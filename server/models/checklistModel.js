const BaseModel = require("./BaseModel");
const Db = require('../config/db');

class ChecklistModel extends BaseModel {
    constructor(userId = null) {
        super(userId);

        this.tableName = "checklists";
        this.hasCreatedBy = true;
    }

    // ================= CREATE =================
    async createChecklist(data) {
        const insertData = this.insertStatement(data);

        const result = await Db.raw(
            `
            INSERT INTO checklists (
                vault_id,
                status, version
            )
            VALUES (
                ?, ?, ?
            )
            RETURNING *
            `,
            [
                insertData.vault_id,
                insertData.status ?? 'active',
                insertData.version ?? '1.0'
            ]
        );

        return result.rows[0];
    }

    // ================= GET BY ID =================
    async getChecklistById(checklistId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM checklists
            WHERE id = ?
            LIMIT 1
            `,
            [checklistId]
        );

        return result.rows[0];
    }

    // ================= GET VAULT CHECKLISTS =================
    async getChecklistsByVault(vaultId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM checklists
            WHERE vault_id = ?
            ORDER BY created_at DESC
            `,
            [vaultId]
        );

        return result.rows;
    }

    // ================= GET BY TYPE =================
    async getChecklistsByStatus(vaultId, status) {
        const result = await Db.raw(
            `
            SELECT *
            FROM checklists
            WHERE vault_id = ?
              AND status = ?
            ORDER BY created_at DESC
            `,
            [
                vaultId,
                status
            ]
        );

        return result.rows;
    }

    // ================= UPDATE =================
    async updateChecklist(checklistId, data) {
        const updateData = this.getDefinedObject(
            await this.updateStatement(data)
        );

        const columns = Object.keys(updateData);

        if (columns.length === 0) {
            return this.getChecklistById(checklistId);
        }

        const values = Object.values(updateData);

        const setClause = columns
            .map(column => `${column} = ?`)
            .join(", ");

        values.push(checklistId);

        const result = await Db.raw(
            `
            UPDATE checklists
            SET ${setClause}
            WHERE id = ?
            RETURNING *
            `,
            values
        );

        return result.rows[0];
    }

    // ================= UPDATE STATUS =================
    async updateStatus(checklistId, status) {
        const result = await Db.raw(
            `
            UPDATE checklists
            SET
                status = ?,
                updated_at = NOW()
            WHERE id = ?
            RETURNING *
            `,
            [
                status,
                checklistId
            ]
        );

        return result.rows[0];
    }

    // ================= DELETE =================
    async deleteChecklist(checklistId) {
        const result = await Db.raw(`UPDATE checklists SET status = 'archived', updated_at = NOW() WHERE id = ? RETURNING id`, [checklistId]);
        return result.rows[0];
    }
}

module.exports = ChecklistModel;
