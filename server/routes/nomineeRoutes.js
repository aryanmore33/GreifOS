const express = require("express");

const {
  setNominee,
  getNominee,
  updateNominee
} = require("../controllers/nomineeController");

const { jwtAuthMiddleware } = require("../middlewares/jwtAuthMiddleware");

const router = express.Router();

router.post("/set", jwtAuthMiddleware, setNominee);
router.get("/", jwtAuthMiddleware, getNominee);
router.put("/update", jwtAuthMiddleware, updateNominee);

module.exports = router;