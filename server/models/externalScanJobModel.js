const BaseModel = require("./BaseModel");
const Db = require('../config/db');

class ExternalScanJobModel extends BaseModel {
    constructor(userId = null) {
        super(userId);

        this.tableName = "external_scan_jobs";
        this.hasCreatedBy = true;
    }

    // ================= CREATE =================
    async createJob(data) {
        const insertData = this.insertStatement(data);

        const result = await Db.raw(
            `
            INSERT INTO external_scan_jobs (
                vault_id,
                provider,
                status
            )
            VALUES (?, ?, ?)
            RETURNING *
            `,
            [
                insertData.vault_id,
                insertData.provider,
                insertData.status ?? "pending"
            ]
        );

        return result.rows[0];
    }

    // ================= GET BY ID =================
    async getJobById(jobId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM external_scan_jobs
            WHERE id = ?
            LIMIT 1
            `,
            [jobId]
        );

        return result.rows[0];
    }

    // ================= GET BY VERIFICATION CASE =================
    async getJobsByVault(vaultId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM external_scan_jobs
            WHERE vault_id = ?
            ORDER BY created_at DESC
            `,
            [vaultId]
        );

        return result.rows;
    }

    // ================= GET BY EXTERNAL ID =================
    async getLatestJobByProvider(vaultId, provider) {
        const result = await Db.raw(
            `
            SELECT *
            FROM external_scan_jobs
            WHERE vault_id = ? AND provider = ?
            ORDER BY created_at DESC
            LIMIT 1
            `,
            [vaultId, provider]
        );

        return result.rows[0];
    }

    // ================= UPDATE STATUS =================
    async updateStatus(jobId, status) {
        const result = await Db.raw(
            `
            UPDATE external_scan_jobs
            SET
                status = ?,
                updated_at = NOW()
            WHERE id = ?
            RETURNING *
            `,
            [
                status,
                jobId
            ]
        );

        return result.rows[0];
    }

    // ================= COMPLETE =================
    async completeJob(jobId, status) {
        const result = await Db.raw(
            `
            UPDATE external_scan_jobs
            SET
                status = ?,
                completed_at = NOW(),
                updated_at = NOW()
            WHERE id = ?
            RETURNING *
            `,
            [
                status,
                jobId
            ]
        );

        return result.rows[0];
    }

    // ================= DELETE =================
    async deleteJob(jobId) {
        const result = await Db.raw(`DELETE FROM external_scan_jobs WHERE id = ? RETURNING id`, [jobId]);
        return result.rows[0];
    }
}

module.exports = ExternalScanJobModel;
