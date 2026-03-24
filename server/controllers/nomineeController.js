const nomineeModel = require("../models/nomineeModel");
const vaultModel = require("../models/vaultModel");


// ================= SET =================
const setNominee = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const {
      nominee_name,
      nominee_phone,
      relationship
    } = req.body;

    if (!nominee_name || !nominee_phone || !relationship) {
      return res.status(400).json({
        error: "All fields required"
      });
    }

    const vault = await vaultModel.getVaultByOwner(ownerId);

    const nominee = await nomineeModel.setNominee(
      ownerId,
      vault.id,
      nominee_name,
      nominee_phone,
      relationship
    );

    res.status(200).json({
      message: "Nominee saved",
      nominee
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to set nominee"
    });
  }
};


// ================= GET =================
const getNominee = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const nominee = await nomineeModel.getNominee(ownerId);

    res.status(200).json({
      nominee
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch nominee"
    });
  }
};


// ================= UPDATE =================
const updateNominee = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const nominee = await nomineeModel.updateNominee(
      ownerId,
      req.body
    );

    res.status(200).json({
      message: "Nominee updated",
      nominee
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed to update nominee"
    });
  }
};

module.exports = {
  setNominee,
  getNominee,
  updateNominee
};