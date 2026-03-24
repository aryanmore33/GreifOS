const pool = require("../config/pool");

// ================= SET NOMINEE =================
const setNominee = async (
  ownerId,
  vaultId,
  nominee_name,
  nominee_phone,
  relationship
) => {
  const query = `
    INSERT INTO nominees
    (
      owner_id,
      vault_id,
      nominee_name,
      nominee_phone,
      relationship
    )
    VALUES ($1,$2,$3,$4,$5)
    ON CONFLICT (vault_id)
    DO UPDATE SET
      nominee_name = EXCLUDED.nominee_name,
      nominee_phone = EXCLUDED.nominee_phone,
      relationship = EXCLUDED.relationship,
      updated_at = NOW()
    RETURNING *
  `;

  const result = await pool.query(query, [
    ownerId,
    vaultId,
    nominee_name,
    nominee_phone,
    relationship
  ]);

  return result.rows[0];
};


// ================= GET =================
const getNominee = async (ownerId) => {
  const result = await pool.query(
    `
    SELECT * FROM nominees
    WHERE owner_id = $1
    `,
    [ownerId]
  );

  return result.rows[0];
};


// ================= UPDATE =================
const updateNominee = async (ownerId, data) => {
  const query = `
    UPDATE nominees
    SET
      nominee_name = COALESCE($2, nominee_name),
      nominee_phone = COALESCE($3, nominee_phone),
      relationship = COALESCE($4, relationship),
      updated_at = NOW()
    WHERE owner_id = $1
    RETURNING *
  `;

  const result = await pool.query(query, [
    ownerId,
    data.nominee_name,
    data.nominee_phone,
    data.relationship
  ]);

  return result.rows[0];
};

module.exports = {
  setNominee,
  getNominee,
  updateNominee
};