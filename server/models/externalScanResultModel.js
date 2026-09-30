const BaseModel = require("./BaseModel");
const Db = require('../config/db');

class ExternalScanResultModel extends BaseModel {
    constructor(userId = null) {
        super(userId);

        this.tableName = "external_scan_results";
        this.hasCreatedBy = false;
    }

    // ================= CREATE =================
    async createResult(data) {
        const insertData = this.insertStatement(data);

        const result = await Db.raw(
            `
            INSERT INTO external_scan_results (
                scan_job_id,
                result_found,
                amount_found,
                currency,
                result_summary,
                claim_url,
                result_data
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            RETURNING *
            `,
            [
                insertData.scan_job_id,
                insertData.result_found ?? false,
                insertData.amount_found ?? null,
                insertData.currency ?? 'INR',
                insertData.result_summary ?? null,
                insertData.claim_url ?? null,
                insertData.result_data ?? null
            ]
        );

        return result.rows[0];
    }

    // ================= GET BY ID =================
    async getResultById(resultId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM external_scan_results
            WHERE id = ?
            LIMIT 1
            `,
            [resultId]
        );

        return result.rows[0];
    }

    // ================= GET JOB RESULTS =================
    async getResultsByJob(scanJobId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM external_scan_results
            WHERE scan_job_id = ?
            ORDER BY created_at DESC
            `,
            [scanJobId]
        );

        return result.rows;
    }

    // ================= UPDATE =================
    async updateResult(resultId, data) {
        const updateData = this.getDefinedObject(
            await this.updateStatement(data)
        );

        const columns = Object.keys(updateData);

        if (columns.length === 0) {
            return this.getResultById(resultId);
        }

        const values = Object.values(updateData);

        const setClause = columns
            .map(column => `${column} = ?`)
            .join(", ");

        values.push(resultId);

        const result = await Db.raw(
            `
            UPDATE external_scan_results
            SET ${setClause}
            WHERE id = ?
            RETURNING *
            `,
            values
        );

        return result.rows[0];
    }
}

module.exports = ExternalScanResultModel;
