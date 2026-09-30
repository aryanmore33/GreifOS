const Db = require('../config/db');
const BaseModel = require("./BaseModel");

class UserModel extends BaseModel {
  constructor (userId = null){
    super(userId);
    this.tableName = "users";
    this.hasCreatedBy = false;
  }
  async createUser(data) {
        const result = await Db.raw(
            `
            INSERT INTO users (
                name_ciphertext,
                name_iv,
                name_auth_tag,

                email_ciphertext,
                email_iv,
                email_auth_tag,
                email_lookup_hmac,

                phone_ciphertext,
                phone_iv,
                phone_auth_tag,
                phone_lookup_hmac,

                dob_ciphertext,
                dob_iv,
                dob_auth_tag,

                password_hash,
                role
            )
            VALUES (
                ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?,
                ?, ?
            )
            RETURNING
                id,
                name_ciphertext,
                name_iv,
                name_auth_tag,
                email_ciphertext,
                email_iv,
                email_auth_tag,
                email_lookup_hmac,
                phone_ciphertext,
                phone_iv,
                phone_auth_tag,
                phone_lookup_hmac,
                dob_ciphertext,
                dob_iv,
                dob_auth_tag,
                role,
                created_at
            `,
            [
                data.name_ciphertext,
                data.name_iv,
                data.name_auth_tag,

                data.email_ciphertext,
                data.email_iv,
                data.email_auth_tag,
                data.email_lookup_hmac,

                data.phone_ciphertext,
                data.phone_iv,
                data.phone_auth_tag,
                data.phone_lookup_hmac,

                data.dob_ciphertext,
                data.dob_iv,
                data.dob_auth_tag,

                data.password_hash,
                data.role
            ]
        );

        return result.rows[0];
    }

    // ================= FIND BY ID =================
    async findUserById(id) {
        const result = await Db.raw(
            `
            SELECT *
            FROM users
            WHERE id = ?
              AND deleted_at IS NULL
            LIMIT 1
            `,
            [id]
        );

        return result.rows[0];
    }

    // ================= FIND BY EMAIL HMAC =================
    async findUserByEmailLookupHmac(emailLookupHmac) {
        const result = await Db.raw(
            `
            SELECT *
            FROM users
            WHERE email_lookup_hmac = ?
              AND deleted_at IS NULL
            LIMIT 1
            `,
            [emailLookupHmac]
        );

        return result.rows[0];
    }

    // ================= FIND BY PHONE HMAC =================
    async findUserByPhoneLookupHmac(phoneLookupHmac) {
        const result = await Db.raw(
            `
            SELECT *
            FROM users
            WHERE phone_lookup_hmac = ?
              AND deleted_at IS NULL
            LIMIT 1
            `,
            [phoneLookupHmac]
        );

        return result.rows[0];
    }

    // ================= UPDATE =================
    async updateUser(id, data) {
        const updateData = this.getDefinedObject(
            await this.updateStatement(data)
        );

        const columns = Object.keys(updateData);

        if (columns.length === 0) {
            return this.findUserById(id);
        }

        const values = Object.values(updateData);

        const setClause = columns
            .map(column => `${column} = ?`)
            .join(", ");

        values.push(id);

        const result = await Db.raw(
            `
            UPDATE users
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

    // ================= VERIFY PHONE =================
    async verifyUserPhone(phoneLookupHmac) {
        const result = await Db.raw(
            `
            UPDATE users
            SET
                is_phone_verified = TRUE,
                updated_at = NOW()
            WHERE phone_lookup_hmac = ?
              AND deleted_at IS NULL
            RETURNING *
            `,
            [phoneLookupHmac]
        );

        return result.rows[0];
    }

    // ================= VERIFY EMAIL =================
    async verifyUserEmail(emailLookupHmac) {
        const result = await Db.raw(
            `
            UPDATE users
            SET
                is_identity_verified = TRUE,
                updated_at = NOW()
            WHERE email_lookup_hmac = ?
              AND deleted_at IS NULL
            RETURNING *
            `,
            [emailLookupHmac]
        );

        return result.rows[0];
    }

    // ================= SOFT DELETE =================
    async deleteUser(id) {
        const updateData = await this.updateStatement({
            deleted_at: new Date()
        });

        const result = await Db.raw(
            `
            UPDATE users
            SET
                deleted_at = ?,
                updated_at = NOW()
            WHERE id = ?
              AND deleted_at IS NULL
            RETURNING id
            `,
            [
                updateData.deleted_at,
                id
            ]
        );

        return result.rows[0];
    }
}

module.exports = UserModel;

