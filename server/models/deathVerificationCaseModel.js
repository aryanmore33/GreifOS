const BaseModel = require("./BaseModel");
const Db = require('../config/db');

class DeathVerificationCaseModel extends BaseModel {
    constructor(userId = null) {
        super(userId);

        this.tableName = "death_verification_cases";
        this.hasCreatedBy = true;
    }

    // ================= CREATE =================
    async createCase(data) {
        const insertData = this.insertStatement(data);

        const result = await Db.raw(
            `
            INSERT INTO death_verification_cases (
                vault_id,
                nominee_id,
                death_certificate_document_id,
                status,
                verification_level,
                submitted_at
            )
            VALUES (
                ?, ?, ?, ?, ?, ?
            )
            RETURNING *
            `,
            [
                insertData.vault_id,
                insertData.nominee_id ?? null,
                insertData.death_certificate_document_id ?? insertData.document_id ?? null,
                insertData.status ?? 'pending',
                insertData.verification_level ?? 'pending',
                insertData.submitted_at ?? insertData.started_at ?? new Date()
            ]
        );

        return result.rows[0];
    }

    // ================= GET BY ID =================
    async getCaseById(caseId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM death_verification_cases
            WHERE id = ?
            LIMIT 1
            `,
            [caseId]
        );

        return result.rows[0];
    }

    // ================= GET VAULT CASES =================
    async getCasesByVault(vaultId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM death_verification_cases
            WHERE vault_id = ?
            ORDER BY created_at DESC
            `,
            [vaultId]
        );

        return result.rows;
    }

    // ================= GET ACTIVE CASE =================
    async getActiveCase(vaultId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM death_verification_cases
            WHERE vault_id = ?
              AND status IN (
                  'pending',
                  'ocr_processing', 'under_review'
              )
            ORDER BY created_at DESC
            LIMIT 1
            `,
            [vaultId]
        );

        return result.rows[0];
    }

    // ================= UPDATE STATUS =================
    async updateStatus(caseId, status, reason = null) {
        const result = await Db.raw(
            `
            UPDATE death_verification_cases
            SET
                status = ?,
                rejection_reason = ?,
                updated_at = NOW()
            WHERE id = ?
            RETURNING *
            `,
            [
                status,
                reason,
                caseId
            ]
        );

        return result.rows[0];
    }

    // ================= COMPLETE =================
    async completeCase(caseId, status) {
        const result = await Db.raw(
            `
            UPDATE death_verification_cases
            SET
                status = ?,
                verified_at = CASE WHEN ? = 'verified' THEN NOW() ELSE verified_at END,
                updated_at = NOW()
            WHERE id = ?
            RETURNING *
            `,
            [
                status,
                status,
                caseId
            ]
        );

        return result.rows[0];
    }

    // ================= DELETE =================
    async deleteCase(caseId) {
        const result = await Db.raw(`DELETE FROM death_verification_cases WHERE id = ? RETURNING id`, [caseId]);
        return result.rows[0];
    }
}

module.exports = DeathVerificationCaseModel;
