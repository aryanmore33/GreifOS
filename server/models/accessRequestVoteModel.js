const BaseModel = require("./BaseModel");
const Db = require('../config/db');

class AccessRequestVoteModel extends BaseModel {
    constructor(userId = null) {
        super(userId);

        this.tableName = "access_request_votes";
        this.hasCreatedBy = false;
    }

    // ================= CREATE VOTE =================
    async createVote(data) {
        const result = await Db.raw(
            `
            INSERT INTO access_request_votes (
                access_request_id,
                nominee_id,
                decision,
                reason,
                decided_at
            )
            VALUES (?, ?, ?, ?, ?)
            RETURNING *
            `,
            [
                data.access_request_id,
                data.nominee_id,
                data.decision ?? data.status ?? 'pending',
                data.reason ?? null,
                data.decided_at ?? data.responded_at ?? null
            ]
        );

        return result.rows[0];
    }

    // ================= CREATE MULTIPLE VOTES =================
    async createVotes(votes) {
        const results = [];

        for (const vote of votes) {
            const result = await this.createVote(vote);
            results.push(result);
        }

        return results;
    }

    // ================= GET BY ID =================
    async getVoteById(voteId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM access_request_votes
            WHERE id = ?
            LIMIT 1
            `,
            [voteId]
        );

        return result.rows[0];
    }

    // ================= GET REQUEST VOTES =================
    async getVotesByRequest(accessRequestId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM access_request_votes
            WHERE access_request_id = ?
            ORDER BY created_at ASC
            `,
            [accessRequestId]
        );

        return result.rows;
    }

    // ================= GET NOMINEE VOTE =================
    async getNomineeVote(accessRequestId, nomineeId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM access_request_votes
            WHERE access_request_id = ?
              AND nominee_id = ?
            LIMIT 1
            `,
            [
                accessRequestId,
                nomineeId
            ]
        );

        return result.rows[0];
    }

    // ================= RESPOND =================
    async respondToRequest(voteId, status) {
        const result = await Db.raw(
            `
            UPDATE access_request_votes
            SET
                decision = ?,
                decided_at = NOW()
            WHERE id = ?
              AND decision = 'pending'
            RETURNING *
            `,
            [
                status,
                voteId
            ]
        );

        return result.rows[0];
    }

    // ================= COUNT APPROVALS =================
    async countApprovals(accessRequestId) {
        const result = await Db.raw(
            `
            SELECT COUNT(*) AS count
            FROM access_request_votes
            WHERE access_request_id = ?
              AND decision = 'approved'
            `,
            [accessRequestId]
        );

        return Number(result.rows[0].count);
    }

    // ================= COUNT DENIALS =================
    async countDenials(accessRequestId) {
        const result = await Db.raw(
            `
            SELECT COUNT(*) AS count
            FROM access_request_votes
            WHERE access_request_id = ?
              AND decision = 'denied'
            `,
            [accessRequestId]
        );

        return Number(result.rows[0].count);
    }

    // ================= COUNT PENDING =================
    async countPending(accessRequestId) {
        const result = await Db.raw(
            `
            SELECT COUNT(*) AS count
            FROM access_request_votes
            WHERE access_request_id = ?
              AND decision = 'pending'
            `,
            [accessRequestId]
        );

        return Number(result.rows[0].count);
    }
}

module.exports = AccessRequestVoteModel;
