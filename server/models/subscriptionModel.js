const BaseModel = require("./BaseModel");
const Db = require('../config/db');

class SubscriptionModel extends BaseModel {
    constructor(userId = null) {
        super(userId);

        this.tableName = "subscriptions";
        this.hasCreatedBy = false;
    }

    // ================= CREATE =================
    async createSubscription(data) {
        const insertData = this.insertStatement(data);

        const result = await Db.raw(
            `
            INSERT INTO subscriptions (
                asset_id, merchant_name, amount, currency, frequency,
                last_charge_date, next_charge_date, cancellation_steps
            )
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?
            )
            RETURNING *
            `,
            [
                insertData.asset_id,
                insertData.merchant_name,
                insertData.amount ?? null,
                insertData.currency ?? 'INR',
                insertData.frequency ?? null,
                insertData.last_charge_date ?? null,
                insertData.next_charge_date ?? null,
                insertData.cancellation_steps ?? null
            ]
        );

        return result.rows[0];
    }

    // ================= GET BY ID =================
    async getSubscriptionById(subscriptionId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM subscriptions
            WHERE id = ?
            LIMIT 1
            `,
            [subscriptionId]
        );

        return result.rows[0];
    }

    // ================= GET USER SUBSCRIPTION =================
    async getSubscriptionByAsset(assetId) {
        const result = await Db.raw(
            `
            SELECT *
            FROM subscriptions
            WHERE asset_id = ?
            LIMIT 1
            `,
            [assetId]
        );

        return result.rows[0];
    }

    // ================= GET VAULT SUBSCRIPTION =================
    async getSubscriptionByVault(vaultId) {
        const result = await Db.raw(`SELECT s.* FROM subscriptions s JOIN assets a ON a.id = s.asset_id WHERE a.vault_id = ? ORDER BY s.created_at DESC`, [vaultId]);
        return result.rows;
    }

    // ================= UPDATE =================
    async updateSubscription(subscriptionId, data) {
        const updateData = this.getDefinedObject(
            await this.updateStatement(data)
        );

        const columns = Object.keys(updateData);

        if (columns.length === 0) {
            return this.getSubscriptionById(subscriptionId);
        }

        const values = Object.values(updateData);

        const setClause = columns
            .map(column => `${column} = ?`)
            .join(", ");

        values.push(subscriptionId);

        const result = await Db.raw(
            `
            UPDATE subscriptions
            SET ${setClause},
                updated_at = NOW()
            WHERE id = ?
            RETURNING *
            `,
            values
        );

        return result.rows[0];
    }

    // ================= UPDATE STATUS =================
    async updateFrequency(subscriptionId, frequency) {
        const result = await Db.raw(
            `
            UPDATE subscriptions
            SET
                frequency = ?,
                updated_at = NOW()
            WHERE id = ?
            RETURNING *
            `,
            [
                frequency,
                subscriptionId
            ]
        );

        return result.rows[0];
    }

    // ================= UPDATE BILLING PERIOD =================
    async updateBillingPeriod(
        subscriptionId,
        periodStart,
        periodEnd
    ) {
        const result = await Db.raw(
            `
            UPDATE subscriptions
            SET
                last_charge_date = ?,
                next_charge_date = ?,
                updated_at = NOW()
            WHERE id = ?
            RETURNING *
            `,
            [
                periodStart,
                periodEnd,
                subscriptionId
            ]
        );

        return result.rows[0];
    }

    // ================= CANCEL =================
    async updateCancellationSteps(subscriptionId, cancellationSteps) {
        const result = await Db.raw(
            `
            UPDATE subscriptions
            SET
                cancellation_steps = ?,
                updated_at = NOW()
            WHERE id = ?
            RETURNING *
            `,
            [cancellationSteps, subscriptionId]
        );

        return result.rows[0];
    }

    // ================= DELETE =================
    async deleteSubscription(subscriptionId) {
        const result = await Db.raw(
            `
            DELETE FROM subscriptions WHERE id = ? RETURNING id
            `,
            [subscriptionId]
        );

        return result.rows[0];
    }
}

module.exports = SubscriptionModel;
