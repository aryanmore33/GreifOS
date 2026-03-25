const express = require("express");

const {
  uploadCertificate,
  verifyCertificate
} = require("../controllers/deathController");

const { jwtAuthMiddleware } = require("../middlewares/jwtAuthMiddleware");
const upload = require("../middlewares/uploadDeathCert");

const router = express.Router();

router.post(
  "/upload",
  jwtAuthMiddleware,
  upload.single("certificate"),
  uploadCertificate
);

router.post(
  "/verify/:id",
  jwtAuthMiddleware,
  verifyCertificate
);

module.exports = router;