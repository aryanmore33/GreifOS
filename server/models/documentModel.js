const BaseModel = require("./BaseModel");
const Db = require('../config/db');

class DocumentModel extends BaseModel {
    constructor(userId = null) {
        super(userId);

        this.tableName = "documents";
        this.hasCreatedBy = true;
    }

    // ================= CREATE =================
    async createDocument(data) {
        const insertData = this.insertStatement(data);

        const result = await Db.raw(
            `
            INSERT INTO documents (
                vault_id,
                uploaded_by_user_id,
                document_type,
                original_filename,
                storage_key,
                mime_type,
                file_size_bytes,
                sha256_hash,
                status
            )
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
            RETURNING *
            `,
            [
                insertData.vault_id,
                insertData.uploaded_by_user_id ?? insertData.uploaded_by ?? null,
                insertData.document_type,
                insertData.original_filename ?? insertData.file_name,
                insertData.storage_key,
                insertData.mime_type,
                insertData.file_size_bytes ?? insertData.file_size,
                insertData.sha256_hash ?? insertData.checksum,
                insertData.status ?? 'uploaded'
            ]
        );

        return result.rows[0];
    }

    // ================= GET BY ID =================
    async getDocumentById(documentId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM documents
            WHERE id = ?
              AND deleted_at IS NULL
            LIMIT 1
            `,
            [documentId]
        );

        return result.rows[0];
    }

    // ================= GET VAULT DOCUMENTS =================
    async getDocumentsByVault(vaultId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM documents
            WHERE vault_id = ?
              AND deleted_at IS NULL
            ORDER BY created_at DESC
            `,
            [vaultId]
        );

        return result.rows;
    }

    // ================= GET BY TYPE =================
    async getDocumentsByType(vaultId, documentType) {
        const result = await Db.raw(
            `
            SELECT *
            FROM documents
            WHERE vault_id = ?
              AND document_type = ?
              AND deleted_at IS NULL
            ORDER BY created_at DESC
            `,
            [
                vaultId,
                documentType
            ]
        );

        return result.rows;
    }

    // ================= UPDATE =================
    async updateDocument(documentId, data) {
        const updateData = this.getDefinedObject(
            await this.updateStatement(data)
        );

        const columns = Object.keys(updateData);

        if (columns.length === 0) {
            return this.getDocumentById(documentId);
        }

        const values = Object.values(updateData);

        const setClause = columns
            .map(column => `${column} = ?`)
            .join(", ");

        values.push(documentId);

        const result = await Db.raw(
            `
            UPDATE documents
            SET ${setClause},
                updated_at = NOW()
            WHERE id = ?
              AND deleted_at IS NULL
            RETURNING *
            `,
            values
        );

        return result.rows[0];
    }

    // ================= DELETE =================
    async deleteDocument(documentId) {
        const updateData = await this.updateStatement({
            deleted_at: new Date()
        });

        const result = await Db.raw(
            `
            UPDATE documents
            SET
                deleted_at = ?,
                updated_at = NOW()
            WHERE id = ?
              AND deleted_at IS NULL
            RETURNING id
            `,
            [
                updateData.deleted_at,
                documentId
            ]
        );

        return result.rows[0];
    }
}

module.exports = DocumentModel;
