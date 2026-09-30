const BaseModel = require("./BaseModel");
const Db = require('../config/db');

class VaultAccessGrantModel extends BaseModel {
    constructor(userId = null) {
        super(userId);

        this.tableName = "vault_access_grants";
        this.hasCreatedBy = true;
    }

    // ================= CREATE GRANT =================
    async createGrant(data) {
        const insertData = this.insertStatement(data);

        const result = await Db.raw(
            `
            INSERT INTO vault_access_grants (
                vault_id,
                nominee_id,
                access_request_id,
                access_level,
                granted_at,
                expires_at,
                is_active
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            RETURNING *
            `,
            [
                insertData.vault_id,
                insertData.nominee_id,
                insertData.access_request_id,
                insertData.access_level,
                insertData.granted_at,
                insertData.expires_at,
                insertData.is_active ?? (insertData.status ? insertData.status === 'active' : true)
            ]
        );

        return result.rows[0];
    }

    // ================= GET BY ID =================
    async getGrantById(grantId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM vault_access_grants
            WHERE id = ?
            LIMIT 1
            `,
            [grantId]
        );

        return result.rows[0];
    }

    // ================= GET USER GRANTS =================
    async getGrantsByUser(userId) {
        const result = await Db.raw(
            `
            SELECT g.*
            FROM vault_access_grants g
            JOIN vault_nominees n ON n.id = g.nominee_id
            WHERE n.user_id = ?
              AND g.is_active = TRUE
            ORDER BY g.granted_at DESC
            `,
            [userId]
        );

        return result.rows;
    }

    // ================= GET VAULT GRANTS =================
    async getGrantsByVault(vaultId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM vault_access_grants
            WHERE vault_id = ?
            ORDER BY granted_at DESC
            `,
            [vaultId]
        );

        return result.rows;
    }

    // ================= GET USER VAULT GRANT =================
    async getUserVaultGrant(vaultId, userId) {
        const result = await Db.raw(
            `
            SELECT g.*
            FROM vault_access_grants g
            JOIN vault_nominees n ON n.id = g.nominee_id
            WHERE g.vault_id = ?
              AND n.user_id = ?
              AND g.is_active = TRUE
            LIMIT 1
            `,
            [
                vaultId,
                userId
            ]
        );

        return result.rows[0];
    }

    // ================= UPDATE STATUS =================
    async updateStatus(grantId, status) {
        const result = await Db.raw(
            `
            UPDATE vault_access_grants
            SET
                is_active = ?
            WHERE id = ?
            RETURNING *
            `,
            [
                status === 'active',
                grantId
            ]
        );

        return result.rows[0];
    }

    // ================= REVOKE =================
    async revokeGrant(grantId) {
        const result = await Db.raw(
            `
            UPDATE vault_access_grants
            SET
                is_active = FALSE,
                revoked_at = NOW()
            WHERE id = ?
              AND is_active = TRUE
            RETURNING *
            `,
            [grantId]
        );

        return result.rows[0];
    }

    // ================= DELETE =================
    async deleteGrant(grantId) {
        const result = await Db.raw(`DELETE FROM vault_access_grants WHERE id = ? RETURNING id`, [grantId]);
        return result.rows[0];
    }
}

module.exports = VaultAccessGrantModel;
