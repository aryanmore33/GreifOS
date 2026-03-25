const vaultModel = require("../models/vaultModel");
const deathModel = require("../models/deathModel");
const { runOCR, extractName } = require("../services/ocrService");

const uploadCertificate = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const uploadedByPhone = req.user.phone;

    const vault = await vaultModel.getVaultByOwner(ownerId);

    const fileUrl = req.file.location;

    const record = await deathModel.createCertificate(
      vault.id,
      uploadedByPhone,
      fileUrl
    );

    res.status(200).json({
      message: "Certificate uploaded",
      record
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Upload failed"
    });
  }
};

const verifyCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const cert = await deathModel.getCertificate(id);

    const key = cert.file_url.split(".com/")[1];

    const text = await runOCR(
      process.env.S3_BUCKET,
      key
    );

    // simple extraction
    const nameMatch = text.match(/Name[:\- ](.*)/i);
    const dateMatch = text.match(/\d{2}\/\d{2}\/\d{4}/);

    const name =  extractName(text) || null;
    const dod = dateMatch?.[0] || null;

    await deathModel.updateOCR(
      id,
      name,
      dod,
      90,  
      "verified"
    );

    res.json({
      extracted_name: name,
      extracted_dod: dod
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "OCR failed"
    });
  }
};

module.exports = { uploadCertificate, verifyCertificate };