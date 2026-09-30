const BaseModel = require("./BaseModel");
const Db = require('../config/db');

class DeathCertificateDetailsModel extends BaseModel {
    constructor(userId = null) {
        super(userId);

        this.tableName = "death_certificate_details";
        this.hasCreatedBy = false;
    }

    // ================= CREATE =================
    async createDetails(data) {
        const insertData = this.insertStatement(data);

        const result = await Db.raw(
            `
            INSERT INTO death_certificate_details (
                document_id,
                deceased_name, date_of_birth, date_of_death, registration_number,
                registration_date, place_of_death, issuing_authority, father_name,
                mother_name, spouse_name, ocr_text, ocr_confidence, ocr_fields,
                ocr_engine, ocr_engine_version
            )
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
            RETURNING *
            `,
            [
                insertData.document_id,

                insertData.deceased_name ?? null, insertData.date_of_birth ?? null,
                insertData.date_of_death ?? null, insertData.registration_number ?? null,
                insertData.registration_date ?? null, insertData.place_of_death ?? null,
                insertData.issuing_authority ?? null, insertData.father_name ?? null,
                insertData.mother_name ?? null, insertData.spouse_name ?? null,
                insertData.ocr_text ?? null, insertData.ocr_confidence ?? null,
                insertData.ocr_fields ?? null, insertData.ocr_engine ?? null,
                insertData.ocr_engine_version ?? null
            ]
        );

        return result.rows[0];
    }

    // ================= GET BY ID =================
    async getDetailsById(id) {
        const result = await Db.raw(
            `
            SELECT *
            FROM death_certificate_details
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        return result.rows[0];
    }

    // ================= GET BY DOCUMENT =================
    async getDetailsByDocumentId(documentId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM death_certificate_details
            WHERE document_id = ?
            LIMIT 1
            `,
            [documentId]
        );

        return result.rows[0];
    }

    // ================= UPDATE =================
    async updateDetails(id, data) {
        const updateData = this.getDefinedObject(
            await this.updateStatement(data)
        );

        const columns = Object.keys(updateData);

        if (columns.length === 0) {
            return this.getDetailsById(id);
        }

        const values = Object.values(updateData);

        const setClause = columns
            .map(column => `${column} = ?`)
            .join(", ");

        values.push(id);

        const result = await Db.raw(
            `
            UPDATE death_certificate_details
            SET ${setClause}, updated_at = NOW()
            WHERE id = ?
            RETURNING *
            `,
            values
        );

        return result.rows[0];
    }

    // ================= DELETE =================
    async deleteDetails(id) {
        const result = await Db.raw(`DELETE FROM death_certificate_details WHERE id = ? RETURNING id`, [id]);
        return result.rows[0];
    }
}

module.exports = DeathCertificateDetailsModel;
