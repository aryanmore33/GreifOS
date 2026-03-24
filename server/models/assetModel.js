const pool = require("../config/pool");


// ================= ADD SINGLE =================
const addAsset = async (
  ownerId,
  vaultId,
  asset_type,
  institution_name,
  label,
  detected_via,
  notes
) => {
  const query = `
    INSERT INTO assets
    (
      owner_id,
      vault_id,
      asset_type,
      institution_name,
      label,
      detected_via,
      notes
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
  `;

  const result = await pool.query(query, [
    ownerId,
    vaultId,
    asset_type,
    institution_name,
    label || null,
    detected_via || "manual",
    notes || null
  ]);

  return result.rows[0];
};


// ================= BULK ADD =================
const bulkAddAssets = async (ownerId, vaultId, assets) => {
  const inserted = [];

  for (const asset of assets) {
    const result = await pool.query(
      `
      INSERT INTO assets
      (
        owner_id,
        vault_id,
        asset_type,
        institution_name,
        label,
        detected_via,
        notes
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        ownerId,
        vaultId,
        asset.asset_type,
        asset.institution_name,
        asset.label || null,
        asset.detected_via || "sms",
        asset.notes || null
      ]
    );

    inserted.push(result.rows[0]);
  }

  return inserted;
};


// ================= GET =================
const getAssets = async (ownerId) => {
  const result = await pool.query(
    `
    SELECT * FROM assets
    WHERE owner_id = $1
    AND is_active = true
    ORDER BY created_at DESC
    `,
    [ownerId]
  );

  return result.rows;
};


// ================= UPDATE =================
const updateAsset = async (ownerId, assetId, data) => {
  const query = `
    UPDATE assets
    SET 
      label = COALESCE($3, label),
      institution_name = COALESCE($4, institution_name),
      is_confirmed = COALESCE($5, is_confirmed),
      notes = COALESCE($6, notes),
      updated_at = NOW()
    WHERE id = $1 
    AND owner_id = $2
    RETURNING *
  `;

  const result = await pool.query(query, [
    assetId,
    ownerId,
    data.label,
    data.institution_name,
    data.is_confirmed,
    data.notes
  ]);

  return result.rows[0];
};


// ================= DELETE (SOFT DELETE) =================
const deleteAsset = async (ownerId, assetId) => {
  await pool.query(
    `
    UPDATE assets
    SET is_active = false,
        updated_at = NOW()
    WHERE id = $1 
    AND owner_id = $2
    `,
    [assetId, ownerId]
  );
};


module.exports = {
  addAsset,
  bulkAddAssets,
  getAssets,
  updateAsset,
  deleteAsset
};