const BaseModel = require("./BaseModel");
const Db = require('../config/db');

class VaultNomineeModel extends BaseModel {
    constructor(userId = null) {
        super(userId);

        this.tableName = "vault_nominees";
        this.hasCreatedBy = false;
    }

    // ================= CREATE =================
    async createNominee(data) {
        const result = await Db.raw(
            `
            INSERT INTO vault_nominees (
                vault_id,
                user_id,

                name_ciphertext,
                name_iv,
                name_auth_tag,

                phone_ciphertext,
                phone_iv,
                phone_auth_tag,
                phone_lookup_hmac,

                relationship_ciphertext,
                relationship_iv,
                relationship_auth_tag,

                identity_type,
                identity_lookup_hmac,

                encryption_key_version
            )
            VALUES (
                ?, ?,

                ?, ?, ?,

                ?, ?, ?, ?,

                ?, ?, ?,

                ?, ?,

                ?
            )
            RETURNING *
            `,
            [
                data.vault_id,
                data.user_id,

                data.name_ciphertext,
                data.name_iv,
                data.name_auth_tag,

                data.phone_ciphertext,
                data.phone_iv,
                data.phone_auth_tag,
                data.phone_lookup_hmac,

                data.relationship_ciphertext,
                data.relationship_iv,
                data.relationship_auth_tag,

                data.identity_type,
                data.identity_lookup_hmac,

                data.encryption_key_version
            ]
        );

        return result.rows[0];
    }

    // ================= GET BY ID =================
    async getNomineeById(nomineeId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM vault_nominees
            WHERE id = ?
            LIMIT 1
            `,
            [nomineeId]
        );

        return result.rows[0];
    }

    // ================= GET BY VAULT =================
    async getNomineesByVault(vaultId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM vault_nominees
            WHERE vault_id = ?
            ORDER BY created_at ASC
            `,
            [vaultId]
        );

        return result.rows;
    }

    // ================= GET BY USER =================
    async getNomineesByUser(userId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM vault_nominees
            WHERE user_id = ?
            ORDER BY created_at DESC
            `,
            [userId]
        );

        return result.rows;
    }

    // ================= FIND BY PHONE HMAC =================
    async findByPhoneLookupHmac(phoneLookupHmac) {
        const result = await Db.raw(
            `
            SELECT *
            FROM vault_nominees
            WHERE phone_lookup_hmac = ?
            LIMIT 1
            `,
            [phoneLookupHmac]
        );

        return result.rows[0];
    }

    // ================= FIND BY IDENTITY HMAC =================
    async findByIdentityLookupHmac(identityLookupHmac) {
        const result = await Db.raw(
            `
            SELECT *
            FROM vault_nominees
            WHERE identity_lookup_hmac = ?
            LIMIT 1
            `,
            [identityLookupHmac]
        );

        return result.rows[0];
    }

    // ================= UPDATE =================
    async updateNominee(nomineeId, data) {
        const updateData = this.getDefinedObject(
            await this.updateStatement(data)
        );

        const columns = Object.keys(updateData);

        if (columns.length === 0) {
            return this.getNomineeById(nomineeId);
        }

        const values = Object.values(updateData);

        const setClause = columns
            .map(column => `${column} = ?`)
            .join(", ");

        values.push(nomineeId);

        const result = await Db.raw(
            `
            UPDATE vault_nominees
            SET ${setClause},
                updated_at = NOW()
            WHERE id = ?
            RETURNING *
            `,
            values
        );

        return result.rows[0];
    }

    // ================= SOFT DELETE =================
    async deleteNominee(nomineeId) {
        const result = await Db.raw(`UPDATE vault_nominees SET status = 'revoked', revoked_at = NOW(), updated_at = NOW() WHERE id = ? RETURNING id`, [nomineeId]);
        return result.rows[0];
    }
}

module.exports = VaultNomineeModel;
