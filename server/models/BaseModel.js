const Db = require('../config/db');

class BaseModel {
    constructor(userId, dbname = null, isRead = false) {
        this.userId = userId;
    }

    async getQueryBuilder() {
        return Db.getQueryBuilder();
    }

    getUserId() {
        return this.userId;
    }

    /**
     * Adds audit fields during INSERT
     */
insertStatement(insertObj) {
    return insertObj;
}

    /**
     * Helper insert for bulk rows
     */
    insertArrayStatement(rows) {
        return rows.map(r => this.insertStatement(r));
    }

    /**
     * Adds audit fields during UPDATE
     */
    async updateStatement(updateObj) {
        return updateObj;
    }

    /**
     * Common WHERE clause (soft delete support)
     */
    whereStatement(data) {
  return data;
}

    /**
     * Removes undefined values
     */
    getDefinedObject(object) {
        const definedObject = {};

        for (const key in object) {
            if (object[key] !== undefined) {
                definedObject[key] = object[key];
            }
        }

        return definedObject;
    }


}

module.exports = BaseModel;
