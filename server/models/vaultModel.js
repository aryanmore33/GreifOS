const Db = require('../config/db');
const BaseModel = require("./BaseModel");

class VaultModel extends BaseModel {
    constructor(userId = null) {
        super(userId);

        this.tableName = "vaults";
        this.hasCreatedBy = false;
    }

    // ================= CREATE =================
    async createVault(data) {
        const result = await Db.raw(
            `
            INSERT INTO vaults (
                owner_id,
                encrypted_data,
                encryption_iv,
                encryption_auth_tag,
                encryption_algorithm,
                kdf_algorithm,
                encryption_key_version,
                is_active
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING *
            `,
            [
                data.owner_id,
                data.encrypted_data,
                data.encryption_iv,
                data.encryption_auth_tag,
                data.encryption_algorithm,
                data.kdf_algorithm,
                data.encryption_key_version,
                data.is_active
            ]
        );

        return result.rows[0];
    }

    // ================= GET BY OWNER =================
    async getVaultByOwner(ownerId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM vaults
            WHERE owner_id = ?
              AND deleted_at IS NULL
            LIMIT 1
            `,
            [ownerId]
        );

        return result.rows[0];
    }

    // ================= GET BY ID =================
    async getVaultById(vaultId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM vaults
            WHERE id = ?
              AND deleted_at IS NULL
            LIMIT 1
            `,
            [vaultId]
        );

        return result.rows[0];
    }

    // ================= UPDATE =================
    async updateVault(vaultId, data) {
        const updateData = this.getDefinedObject(
            await this.updateStatement(data)
        );

        const columns = Object.keys(updateData);

        if (columns.length === 0) {
            return this.getVaultById(vaultId);
        }

        const values = Object.values(updateData);

        const setClause = columns
            .map(column => `${column} = ?`)
            .join(", ");

        values.push(vaultId);

        const result = await Db.raw(
            `
            UPDATE vaults
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

    // ================= UPDATE LAST SCAN =================
    async updateLastScannedAt(vaultId) {
        const result = await Db.raw(
            `
            UPDATE vaults
            SET
                last_scanned_at = NOW(),
                updated_at = NOW()
            WHERE id = ?
              AND deleted_at IS NULL
            RETURNING *
            `,
            [vaultId]
        );

        return result.rows[0];
    }

    // ================= ACTIVATE / DEACTIVATE =================
    async setActive(vaultId, isActive) {
        const result = await Db.raw(
            `
            UPDATE vaults
            SET
                is_active = ?,
                updated_at = NOW()
            WHERE id = ?
              AND deleted_at IS NULL
            RETURNING *
            `,
            [
                isActive,
                vaultId
            ]
        );

        return result.rows[0];
    }

    // ================= SOFT DELETE =================
    async deleteVault(vaultId) {
        const updateData = await this.updateStatement({
            deleted_at: new Date()
        });

        const result = await Db.raw(
            `
            UPDATE vaults
            SET
                deleted_at = ?,
                updated_at = NOW()
            WHERE id = ?
              AND deleted_at IS NULL
            RETURNING id
            `,
            [
                updateData.deleted_at,
                vaultId
            ]
        );

        return result.rows[0];
    }
}

module.exports = VaultModel;