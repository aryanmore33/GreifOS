const BaseModel = require("./BaseModel");
const Db = require('../config/db');

class AuditLogModel extends BaseModel {
    constructor(userId = null) {
        super(userId);

        this.tableName = "audit_logs";
        this.hasCreatedBy = false;
    }

    // ================= CREATE =================
    async createLog(data) {
        const result = await Db.raw(
            `
            INSERT INTO audit_logs (
                actor_user_id,
                vault_id,
                action,
                ip_address,
                user_agent,
                metadata,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, NOW())
            RETURNING *
            `,
            [
                data.actor_user_id ?? data.user_id ?? null,
                data.vault_id,
                data.action,
                data.ip_address,
                data.user_agent,
                data.metadata
            ]
        );

        return result.rows[0];
    }

    // ================= GET BY ID =================
    async getLogById(logId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM audit_logs
            WHERE id = ?
            LIMIT 1
            `,
            [logId]
        );

        return result.rows[0];
    }

    // ================= GET VAULT LOGS =================
    async getLogsByVault(vaultId, limit = 100) {
        const result = await Db.raw(
            `
            SELECT *
            FROM audit_logs
            WHERE vault_id = ?
            ORDER BY created_at DESC
            LIMIT ?
            `,
            [
                vaultId,
                limit
            ]
        );

        return result.rows;
    }

    // ================= GET USER LOGS =================
    async getLogsByUser(userId, limit = 100) {
        const result = await Db.raw(
            `
            SELECT *
            FROM audit_logs
            WHERE actor_user_id = ?
            ORDER BY created_at DESC
            LIMIT ?
            `,
            [
                userId,
                limit
            ]
        );

        return result.rows;
    }

    // ================= GET ENTITY LOGS =================
    async getLogsByRequest(requestId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM audit_logs
            WHERE request_id = ?
            ORDER BY created_at DESC
            `,
            [
                requestId
            ]
        );

        return result.rows;
    }
}

module.exports = AuditLogModel;
