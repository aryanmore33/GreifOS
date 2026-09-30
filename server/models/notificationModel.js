const BaseModel = require("./BaseModel");
const Db = require('../config/db');

class NotificationModel extends BaseModel {
    constructor(userId = null) {
        super(userId);

        this.tableName = "notifications";
        this.hasCreatedBy = false;
    }

    // ================= CREATE =================
    async createNotification(data) {
        const result = await Db.raw(
            `
            INSERT INTO notifications (
                user_id,
                vault_id,
                access_request_id,
                type,
                title,
                message,
                is_read,
                read_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING *
            `,
            [
                data.user_id,
                data.vault_id ?? null,
                data.access_request_id ?? null,
                data.type,
                data.title,
                data.message,
                data.is_read ?? false,
                data.read_at ?? null
            ]
        );

        return result.rows[0];
    }

    // ================= GET BY ID =================
    async getNotificationById(notificationId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM notifications
            WHERE id = ?
            LIMIT 1
            `,
            [notificationId]
        );

        return result.rows[0];
    }

    // ================= GET USER NOTIFICATIONS =================
    async getUserNotifications(userId, limit = 50) {
        const result = await Db.raw(
            `
            SELECT *
            FROM notifications
            WHERE user_id = ?
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

    // ================= GET UNREAD =================
    async getUnreadNotifications(userId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM notifications
            WHERE user_id = ?
              AND read_at IS NULL
            ORDER BY created_at DESC
            `,
            [userId]
        );

        return result.rows;
    }

    // ================= MARK READ =================
    async markAsRead(notificationId, userId) {
        const result = await Db.raw(
            `
            UPDATE notifications
            SET
                read_at = NOW(),
                is_read = TRUE
            WHERE id = ?
              AND user_id = ?
              AND read_at IS NULL
            RETURNING *
            `,
            [
                notificationId,
                userId
            ]
        );

        return result.rows[0];
    }

    // ================= UPDATE READ STATE =================
    async updateStatus(notificationId, isRead) {
        const result = await Db.raw(
            `
            UPDATE notifications
            SET
                is_read = ?,
                read_at = CASE WHEN ? THEN NOW() ELSE NULL END
            WHERE id = ?
            RETURNING *
            `,
            [
                isRead,
                isRead,
                notificationId
            ]
        );

        return result.rows[0];
    }
}

module.exports = NotificationModel;
