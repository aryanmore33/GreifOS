const BaseModel = require("./BaseModel");
const Db = require('../config/db');

class ChecklistItemModel extends BaseModel {
    constructor(userId = null) {
        super(userId);

        this.tableName = "checklist_items";
        this.hasCreatedBy = false;
    }

    // ================= CREATE =================
    async createItem(data) {
        const insertData = this.insertStatement(data);

        const result = await Db.raw(
            `
            INSERT INTO checklist_items (
                checklist_id,
                asset_id, task_title, task_description, institution_name,
                urgency, status, due_date,
                completed_at, sort_order
            )
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
            RETURNING *
            `,
            [
                insertData.checklist_id,
                insertData.asset_id ?? null,
                insertData.task_title ?? insertData.title,
                insertData.task_description ?? insertData.description ?? null,
                insertData.institution_name ?? null,
                insertData.urgency,
                insertData.status ?? 'pending',
                insertData.due_date ?? null,
                insertData.completed_at ?? null,
                insertData.sort_order ?? 0
            ]
        );

        return result.rows[0];
    }

    // ================= GET BY ID =================
    async getItemById(itemId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM checklist_items
            WHERE id = ?
            LIMIT 1
            `,
            [itemId]
        );

        return result.rows[0];
    }

    // ================= GET CHECKLIST ITEMS =================
    async getItemsByChecklist(checklistId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM checklist_items
            WHERE checklist_id = ?
            ORDER BY sort_order ASC, created_at ASC
            `,
            [checklistId]
        );

        return result.rows;
    }

    // ================= UPDATE =================
    async updateItem(itemId, data) {
        const updateData = this.getDefinedObject(
            await this.updateStatement(data)
        );

        const columns = Object.keys(updateData);

        if (columns.length === 0) {
            return this.getItemById(itemId);
        }

        const values = Object.values(updateData);

        const setClause = columns
            .map(column => `${column} = ?`)
            .join(", ");

        values.push(itemId);

        const result = await Db.raw(
            `
            UPDATE checklist_items
            SET ${setClause}
            WHERE id = ?
            RETURNING *
            `,
            values
        );

        return result.rows[0];
    }

    // ================= COMPLETE ITEM =================
    async completeItem(itemId) {
        const result = await Db.raw(
            `
            UPDATE checklist_items
            SET
                status = 'completed',
                completed_at = NOW(),
                updated_at = NOW()
            WHERE id = ?
            RETURNING *
            `,
            [itemId]
        );

        return result.rows[0];
    }

    // ================= UNCOMPLETE ITEM =================
    async uncompleteItem(itemId) {
        const result = await Db.raw(
            `
            UPDATE checklist_items
            SET
                status = 'pending',
                completed_at = NULL,
                updated_at = NOW()
            WHERE id = ?
            RETURNING *
            `,
            [itemId]
        );

        return result.rows[0];
    }

    // ================= DELETE =================
    async deleteItem(itemId) {
        const result = await Db.raw(`DELETE FROM checklist_items WHERE id = ? RETURNING id`, [itemId]);
        return result.rows[0];
    }
}

module.exports = ChecklistItemModel;
