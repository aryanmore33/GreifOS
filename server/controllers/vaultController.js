const vaultModel = require("../models/vaultModel");

// ================= CREATE VAULT =================
const createVault = async (req, res) => {
  const { encrypted_data, encryption_iv, pbkdf2_salt } = req.body;

  if (!encrypted_data || !encryption_iv || !pbkdf2_salt) {
    return res.status(400).json({
      error: "Missing encryption fields"
    });
  }

  try {
    const ownerId = req.user.userId;

    const vault = await vaultModel.createVault(
      ownerId,
      encrypted_data,
      encryption_iv,
      pbkdf2_salt
    );

    return res.status(201).json({
      message: "Vault created",
      vaultId: vault.id
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to create vault"
    });
  }
};


// ================= GET VAULT =================
const getVault = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const vault = await vaultModel.getVaultByOwner(ownerId);

    if (!vault) {
      return res.status(404).json({
        error: "Vault not found"
      });
    }

    return res.status(200).json({
      encrypted_data: vault.encrypted_data,
      encryption_iv: vault.encryption_iv,
      pbkdf2_salt: vault.pbkdf2_salt,
      last_scanned_at: vault.last_scanned_at
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to fetch vault"
    });
  }
};


// ================= UPDATE VAULT =================
const updateVault = async (req, res) => {
  const { encrypted_data, encryption_iv } = req.body;

  if (!encrypted_data || !encryption_iv) {
    return res.status(400).json({
      error: "Missing fields"
    });
  }

  try {
    const ownerId = req.user.userId;

    const vault = await vaultModel.updateVault(
      ownerId,
      encrypted_data,
      encryption_iv
    );

    return res.status(200).json({
      message: "Vault updated",
      vault
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to update vault"
    });
  }
};

module.exports = {
  createVault,
  getVault,
  updateVault
};