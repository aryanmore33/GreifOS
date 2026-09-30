const BaseModel = require("./BaseModel");
const Db = require('../config/db');

class VaultAccessRequestModel extends BaseModel {
    constructor(userId = null) {
        super(userId);

        this.tableName = "vault_access_requests";
        this.hasCreatedBy = true;
    }

    // ================= CREATE =================
    async createRequest(data) {
        const insertData = this.insertStatement(data);

        const result = await Db.raw(
            `
            INSERT INTO vault_access_requests (
                vault_id,
                requesting_nominee_id,
                verification_case_id,
                status
            )
            VALUES (?, ?, ?, ?)
            RETURNING *
            `,
            [
                insertData.vault_id,
                insertData.requesting_nominee_id,
                insertData.verification_case_id ?? null,
                insertData.status ?? 'pending'
            ]
        );

        return result.rows[0];
    }

    // ================= GET BY ID =================
    async getRequestById(requestId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM vault_access_requests
            WHERE id = ?
            LIMIT 1
            `,
            [requestId]
        );

        return result.rows[0];
    }

    // ================= GET VAULT REQUESTS =================
    async getRequestsByVault(vaultId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM vault_access_requests
            WHERE vault_id = ?
            ORDER BY created_at DESC
            `,
            [vaultId]
        );

        return result.rows;
    }

    // ================= GET REQUESTER REQUESTS =================
    async getRequestsByRequester(requesterId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM vault_access_requests
            WHERE requesting_nominee_id = ?
            ORDER BY created_at DESC
            `,
            [requesterId]
        );

        return result.rows;
    }

    // ================= GET ACTIVE REQUEST =================
    async getActiveRequest(vaultId, requesterId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM vault_access_requests
            WHERE vault_id = ?
              AND requesting_nominee_id = ?
              AND status IN (
                  'pending',
                  'approved'
              )
            ORDER BY created_at DESC
            LIMIT 1
            `,
            [
                vaultId,
                requesterId
            ]
        );

        return result.rows[0];
    }

    // ================= UPDATE STATUS =================
    async updateStatus(requestId, status) {
        const result = await Db.raw(
            `
            UPDATE vault_access_requests
            SET
                status = ?
            WHERE id = ?
            RETURNING *
            `,
            [
                status,
                requestId
            ]
        );

        return result.rows[0];
    }

    // ================= EXPIRE REQUEST =================
    async expireRequest(requestId) {
        const result = await Db.raw(
            `
            UPDATE vault_access_requests
            SET
                status = 'expired'
            WHERE id = ?
            RETURNING *
            `,
            [requestId]
        );

        return result.rows[0];
    }

    // ================= DELETE =================
    async deleteRequest(requestId) {
        const result = await Db.raw(`DELETE FROM vault_access_requests WHERE id = ? RETURNING id`, [requestId]);
        return result.rows[0];
    }
}

module.exports = VaultAccessRequestModel;
