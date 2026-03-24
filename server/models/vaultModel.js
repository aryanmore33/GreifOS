const pool = require("../config/pool");

const createVault = async (
  ownerId,
  encrypted_data,
  encryption_iv,
  pbkdf2_salt
) => {
  const query = `
    INSERT INTO vaults 
    (owner_id, encrypted_data, encryption_iv, pbkdf2_salt)
    VALUES ($1,$2,$3,$4)
    RETURNING *
  `;

  const result = await pool.query(query, [
    ownerId,
    encrypted_data,
    encryption_iv,
    pbkdf2_salt
  ]);

  return result.rows[0];
};


const getVaultByOwner = async (ownerId) => {
  const query = `
    SELECT * FROM vaults
    WHERE owner_id = $1
  `;

  const result = await pool.query(query, [ownerId]);

  return result.rows[0];
};


const updateVault = async (
  ownerId,
  encrypted_data,
  encryption_iv
) => {
  const query = `
    UPDATE vaults
    SET encrypted_data = $2,
        encryption_iv = $3,
        last_scanned_at = NOW()
    WHERE owner_id = $1
    RETURNING *
  `;

  const result = await pool.query(query, [
    ownerId,
    encrypted_data,
    encryption_iv
  ]);

  return result.rows[0];
};

module.exports = {
  createVault,
  getVaultByOwner,
  updateVault
};