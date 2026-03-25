const pool = require("../config/pool");

const createCertificate = async (
  vaultId,
  uploadedByPhone,
  fileUrl
) => {
  const result = await pool.query(
    `
    INSERT INTO death_certificates
    (vault_id, uploaded_by_phone, file_url)
    VALUES ($1,$2,$3)
    RETURNING *
    `,
    [vaultId, uploadedByPhone, fileUrl]
  );

  return result.rows[0];
};

const getCertificate = async (id) => {
  const result = await pool.query(
    `
    SELECT * FROM death_certificates
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};


// UPDATE OCR
const updateOCR = async (
  id,
  name,
  dod,
  confidence,
  status
) => {
  const result = await pool.query(
    `
    UPDATE death_certificates
    SET 
    ocr_extracted_name = $2,
    ocr_extracted_dod = $3,
    ocr_confidence_score = $4,
    verification_status = $5,
    verified_at = NOW()
    WHERE id = $1
    RETURNING *
    `,
    [id, name, dod, confidence, status]
  );

  return result.rows[0];
};

module.exports = { createCertificate, getCertificate, updateOCR };