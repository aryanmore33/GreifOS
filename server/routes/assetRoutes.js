const express = require("express");

const {
  addAsset,
  bulkAddAssets,
  getAssets,
  updateAsset,
  deleteAsset
} = require("../controllers/assetController");

const { jwtAuthMiddleware } = require("../middlewares/jwtAuthMiddleware");

const router = express.Router();

router.post("/", jwtAuthMiddleware, addAsset);
router.post("/bulk", jwtAuthMiddleware, bulkAddAssets);
router.get("/", jwtAuthMiddleware, getAssets);
router.put("/:id", jwtAuthMiddleware, updateAsset);
router.delete("/:id", jwtAuthMiddleware, deleteAsset);

module.exports = router;