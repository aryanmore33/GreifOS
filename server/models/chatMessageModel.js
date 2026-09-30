const BaseModel = require("./BaseModel");
const Db = require('../config/db');

class ChatMessageModel extends BaseModel {
    constructor(userId = null) {
        super(userId);

        this.tableName = "chat_messages";
        this.hasCreatedBy = false;
    }

    // ================= CREATE =================
    async createMessage(data) {
        const insertData = this.insertStatement(data);

        const result = await Db.raw(
            `
            INSERT INTO chat_messages (
                vault_id,
                user_id, role, content_ciphertext, content_iv,
                content_auth_tag, encryption_algorithm, encryption_key_version,
                model_provider, model_used, prompt_tokens, completion_tokens
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING *
            `,
            [
                insertData.vault_id,
                insertData.user_id ?? null,
                insertData.role,
                insertData.content_ciphertext,
                insertData.content_iv,
                insertData.content_auth_tag,
                insertData.encryption_algorithm ?? 'AES-256-GCM',
                insertData.encryption_key_version ?? 1,
                insertData.model_provider ?? null,
                insertData.model_used ?? null,
                insertData.prompt_tokens ?? null,
                insertData.completion_tokens ?? null
            ]
        );

        return result.rows[0];
    }

    // ================= GET BY ID =================
    async getMessageById(messageId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM chat_messages
            WHERE id = ?
            LIMIT 1
            `,
            [messageId]
        );

        return result.rows[0];
    }

    // ================= GET VAULT CHAT =================
    async getMessagesByVault(vaultId, limit = 50) {
        const result = await Db.raw(
            `
            SELECT *
            FROM chat_messages
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

    // ================= GET BETWEEN USERS =================
    async getConversation(vaultId, userA, userB) {
        const result = await Db.raw(
            `
            SELECT *
            FROM chat_messages
            WHERE vault_id = ?
              AND user_id IN (?, ?)
            ORDER BY created_at ASC
            `,
            [
                vaultId,
                userA,
                userB
            ]
        );

        return result.rows;
    }

    // ================= DELETE =================
    async deleteMessage(messageId) {
        const result = await Db.raw(
            `
            DELETE FROM chat_messages WHERE id = ? RETURNING id
            `,
            [messageId]
        );

        return result.rows[0];
    }
}

module.exports = ChatMessageModel;
