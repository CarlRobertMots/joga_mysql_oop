const conn = require('../utils/db'); // This is your promise pool

class BaseSQLModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async executeQuery(query, params = []) {
    const [results] = await conn.query(query, params);
    return results;
  }

  async findAll() {
    const query = `SELECT * FROM ${this.tableName}`;
    return await this.executeQuery(query);
  }

  async findById(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const results = await this.executeQuery(query, [id]);
    return results[0];
  }

  async findOne(where, value) {
    const query = `SELECT * FROM ${this.tableName} WHERE ${where} = ?`;
    const results = await this.executeQuery(query, [value]);
    return results[0];
  }

  async create(data) {
    const query = `INSERT INTO ${this.tableName} SET ?`;
    const result = await this.executeQuery(query, [data]);
    return result.insertId;
  }

  async update(id, data) {
    const query = `UPDATE ${this.tableName} SET ? WHERE id = ?`;
    const result = await this.executeQuery(query, [data, id]);
    return result.affectedRows;
  }

  async delete(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const result = await this.executeQuery(query, [id]);
    return result.affectedRows;
  }
}

module.exports = BaseSQLModel;