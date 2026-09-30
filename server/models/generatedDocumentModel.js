const BaseModel = require("./BaseModel");
const Db = require('../config/db');

class GeneratedDocumentModel extends BaseModel {
    constructor(userId = null) {
        super(userId);

        this.tableName = "generated_documents";
        this.hasCreatedBy = true;
    }

    // ================= CREATE =================
    async createDocument(data) {
        const insertData = this.insertStatement(data);

        const result = await Db.raw(
            `
            INSERT INTO generated_documents (
                vault_id,
                checklist_item_id,
                document_type,
                institution_name, content, model_provider, model_used,
                prompt_tokens, completion_tokens, pdf_storage_key, status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING *
            `,
            [
                insertData.vault_id,
                insertData.checklist_item_id ?? null,
                insertData.document_type,
                insertData.institution_name ?? null,
                insertData.content,
                insertData.model_provider ?? null,
                insertData.model_used ?? null,
                insertData.prompt_tokens ?? null,
                insertData.completion_tokens ?? null,
                insertData.pdf_storage_key ?? null,
                insertData.status ?? 'generated'
            ]
        );

        return result.rows[0];
    }

    // ================= GET BY ID =================
    async getDocumentById(documentId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM generated_documents
            WHERE id = ?
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
            FROM generated_documents
            WHERE vault_id = ?
            ORDER BY created_at DESC
            `,
            [vaultId]
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
            UPDATE generated_documents
            SET ${setClause}
            WHERE id = ?
            RETURNING *
            `,
            values
        );

        return result.rows[0];
    }

    // ================= DELETE =================
    async deleteDocument(documentId) {
        const result = await Db.raw(`UPDATE generated_documents SET status = 'deleted' WHERE id = ? RETURNING id`, [documentId]);
        return result.rows[0];
    }
}

module.exports = GeneratedDocumentModel;
