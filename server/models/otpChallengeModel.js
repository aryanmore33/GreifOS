const BaseModel = require("./BaseModel");
const Db = require('../config/db');

class OtpChallengeModel extends BaseModel {
    constructor(userId = null) {
        super(userId);

        this.tableName = "otp_challenges";
        this.hasCreatedBy = false;
    }

    // ================= CREATE =================
    async createChallenge(data) {
        const result = await Db.raw(
            `
            INSERT INTO otp_challenges (
                user_id,
                phone_lookup_hmac,
                purpose,
                otp_hash,
                expires_at,
                attempts,
                max_attempts,
                is_used,
                used_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING *
            `,
            [
                data.user_id,
                data.phone_lookup_hmac,
                data.purpose,
                data.otp_hash,
                data.expires_at,
                data.attempts ?? 0,
                data.max_attempts ?? 5,
                data.is_used ?? false,
                data.used_at ?? null
            ]
        );

        return result.rows[0];
    }

    // ================= GET BY ID =================
    async getChallengeById(challengeId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM otp_challenges
            WHERE id = ?
            LIMIT 1
            `,
            [challengeId]
        );

        return result.rows[0];
    }

    // ================= GET ACTIVE CHALLENGE =================
    async getActiveChallenge(userId, purpose) {
        const result = await Db.raw(
            `
            SELECT *
            FROM otp_challenges
            WHERE user_id = ?
              AND purpose = ?
              AND is_used = FALSE
              AND expires_at > NOW()
            ORDER BY created_at DESC
            LIMIT 1
            `,
            [
                userId,
                purpose
            ]
        );

        return result.rows[0];
    }

    // ================= INCREMENT ATTEMPTS =================
    async incrementAttempts(challengeId) {
        const result = await Db.raw(
            `
            UPDATE otp_challenges
            SET
                attempts = attempts + 1,
            WHERE id = ?
            RETURNING *
            `,
            [challengeId]
        );

        return result.rows[0];
    }

    // ================= VERIFY =================
    async markVerified(challengeId) {
        const result = await Db.raw(
            `
            UPDATE otp_challenges
            SET
                is_used = TRUE,
                used_at = NOW()
            WHERE id = ?
              AND is_used = FALSE
            RETURNING *
            `,
            [challengeId]
        );

        return result.rows[0];
    }

    // ================= EXPIRE =================
    async expireChallenge(challengeId) {
        const result = await Db.raw(
            `
            UPDATE otp_challenges
            SET
                expires_at = NOW()
            WHERE id = ?
            RETURNING *
            `,
            [challengeId]
        );

        return result.rows[0];
    }
}

module.exports = OtpChallengeModel;
