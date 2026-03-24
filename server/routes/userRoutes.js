const express = require("express");

const {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  checkAuthenticated,
  logout
} = require("../controllers/userControllers");

const { jwtAuthMiddleware } = require("../middleware/jwtAuthMiddleware");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ success: true, message: "User routes working ✅" });
});

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

router.get("/me", jwtAuthMiddleware, checkAuthenticated);

router.post("/logout", logout);

module.exports = router;