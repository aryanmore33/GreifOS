const BaseModel = require("./BaseModel");
const Db = require('../config/db');

class VerificationEvidenceModel extends BaseModel {
    constructor(userId = null) {
        super(userId);

        this.tableName = "verification_evidence";
        this.hasCreatedBy = false;
    }

    // ================= CREATE =================
    async createEvidence(data) {
        const insertData = this.insertStatement(data);

        const result = await Db.raw(
            `
            INSERT INTO verification_evidence (
                verification_case_id,
                evidence_type,
                status,
                confidence_score,
                extracted_data,
                response_metadata,
                external_reference,
                failure_reason,
                checked_at
            )
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
            RETURNING *
            `,
            [
                insertData.verification_case_id,
                insertData.evidence_type,
                insertData.status,
                insertData.confidence_score,
                insertData.extracted_data,
                insertData.response_metadata,
                insertData.external_reference,
                insertData.failure_reason,
                insertData.checked_at
            ]
        );

        return result.rows[0];
    }

    // ================= GET BY ID =================
    async getEvidenceById(evidenceId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM verification_evidence
            WHERE id = ?
            LIMIT 1
            `,
            [evidenceId]
        );

        return result.rows[0];
    }

    // ================= GET CASE EVIDENCE =================
    async getEvidenceByCase(verificationCaseId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM verification_evidence
            WHERE verification_case_id = ?
            ORDER BY created_at ASC
            `,
            [verificationCaseId]
        );

        return result.rows;
    }

    // ================= GET BY TYPE =================
    async getEvidenceByType(
        verificationCaseId,
        evidenceType
    ) {
        const result = await Db.raw(
            `
            SELECT *
            FROM verification_evidence
            WHERE verification_case_id = ?
              AND evidence_type = ?
            ORDER BY created_at DESC
            `,
            [
                verificationCaseId,
                evidenceType
            ]
        );

        return result.rows;
    }

    // ================= UPDATE =================
    async updateEvidence(evidenceId, data) {
        const updateData = this.getDefinedObject(
            await this.updateStatement(data)
        );

        const columns = Object.keys(updateData);

        if (columns.length === 0) {
            return this.getEvidenceById(evidenceId);
        }

        const values = Object.values(updateData);

        const setClause = columns
            .map(column => `${column} = ?`)
            .join(", ");

        values.push(evidenceId);

        const result = await Db.raw(
            `
            UPDATE verification_evidence
            SET ${setClause}
            WHERE id = ?
            RETURNING *
            `,
            values
        );

        return result.rows[0];
    }

    // ================= DELETE =================
    async deleteEvidence(evidenceId) {
        const result = await Db.raw(`DELETE FROM verification_evidence WHERE id = ? RETURNING id`, [evidenceId]);
        return result.rows[0];
    }
}

module.exports = VerificationEvidenceModel;
