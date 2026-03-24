const express = require("express");

const {
  createVault,
  getVault,
  updateVault
} = require("../controllers/vaultController");

const { jwtAuthMiddleware } = require("../middlewares/jwtAuthMiddleware");

const router = express.Router();

router.post("/create", jwtAuthMiddleware, createVault);
router.get("/me", jwtAuthMiddleware, getVault);
router.put("/update", jwtAuthMiddleware, updateVault);

module.exports = router;