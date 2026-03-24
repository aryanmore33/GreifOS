const assetModel = require("../models/assetModel");
const vaultModel = require("../models/vaultModel");

// ================= ADD SINGLE =================
const addAsset = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const { type, name, institution, masked_identifier, metadata } = req.body;

    const asset = await assetModel.addAsset(
      ownerId,
      type,
      name,
      institution,
      masked_identifier,
      metadata
    );

    res.status(201).json({
      message: "Asset added",
      asset
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add asset" });
  }
};


// ================= BULK ADD =================
const bulkAddAssets = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const { assets } = req.body;

    if (!Array.isArray(assets)) {
      return res.status(400).json({
        error: "assets must be array"
      });
    }
    const vault = await vaultModel.getVaultByOwner(ownerId);
    const inserted = await assetModel.bulkAddAssets(ownerId, vault.id, assets);

    res.status(201).json({
      message: "Assets added",
      count: inserted.length,
      assets: inserted
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Bulk insert failed" });
  }
};


// ================= GET ALL =================
const getAssets = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const assets = await assetModel.getAssets(ownerId);

    res.status(200).json({
      count: assets.length,
      assets
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch assets" });
  }
};


// ================= UPDATE =================
const updateAsset = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const assetId = req.params.id;

    const updated = await assetModel.updateAsset(
      ownerId,
      assetId,
      req.body
    );

    res.status(200).json({
      message: "Asset updated",
      asset: updated
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Update failed" });
  }
};


// ================= DELETE =================
const deleteAsset = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const assetId = req.params.id;

    await assetModel.deleteAsset(ownerId, assetId);

    res.status(200).json({
      message: "Asset deleted"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Delete failed" });
  }
};

module.exports = {
  addAsset,
  bulkAddAssets,
  getAssets,
  updateAsset,
  deleteAsset
};