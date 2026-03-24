const pool = require('../config/pool');

const createUser = async (name, email, passwordHash, role, phone) => {
  try {
    const query = `
      INSERT INTO users (name, email, password_hash, role, phone) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, name, email, role, phone, is_verified, created_at;
    `;

    const result = await pool.query(query, [
      name,
      email,
      passwordHash,
      role,
      phone
    ]);

    return result.rows[0];
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};

const verifyUserPhone = async (phone) => {
  const query = `
    UPDATE users
    SET is_verified = TRUE
    WHERE phone = $1
    RETURNING id, name, email, role, phone, is_verified
  `;
  const result = await pool.query(query, [phone]);
  return result.rows[0];
};

const verifyUserEmail = async (email) => {
  const query = `
    UPDATE users
    SET is_verified = TRUE
    WHERE email = $1
    RETURNING *
  `;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const query = `SELECT * FROM users WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  try {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const findUserByPhone = async (phone) => {
  try {
    const query = `SELECT * FROM users WHERE phone = $1`;
    const result = await pool.query(query, [phone]);
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByPhone,
  verifyUserPhone,
  verifyUserEmail,
  findUserById,
};