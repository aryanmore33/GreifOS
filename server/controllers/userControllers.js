require('dotenv').config();

const userModel = require('../models/userModels');
const otpGenerator = require('../utils/otpGenerator');
const twilioService = require('../services/twilioService');
const sendEmail = require('../services/emailService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!name || !password || !phone || !role) {
    return res.status(400).json({
      error: 'name, phone, password and role are required'
    });
  }

  if (!['owner', 'nominee'].includes(role)) {
    return res.status(400).json({
      error: 'role must be owner or nominee'
    });
  }

  try {
    const existingUser = await userModel.findUserByPhone(phone);
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists with this phone'
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password.toString(), saltRounds);

    const newUser = await userModel.createUser(
      name,
      email || null,
      passwordHash,
      role,
      phone
    );

    const { password_hash, ...userResponse } = newUser;

    return res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    });

  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      error: 'Internal server error during registration'
    });
  }
};

const loginUser = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({
      error: 'phone and password are required'
    });
  }

  try {
    const user = await userModel.findUserByPhone(phone);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        error: 'Invalid phone or password'
      });
    }

    const userData = {
      userId: user.id,
      phone: user.phone,
      role: user.role,
      name: user.name
    };

    const token = jwt.sign(
      userData,
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
        algorithm: 'HS256'
      }
    );

    res.cookie('jwttoken', token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      secure: process.env.NODE_ENV === 'production'
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        is_verified: user.is_verified,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// ================= SEND OTP =================
const sendOtp = async (req, res) => {
  const { phone, phoneSuffix, email } = req.body;

  try {

    // ================= EMAIL OTP =================
    if (email) {
      const otp = otpGenerator();

      // store in memory (temporary)
      global.emailOtps = global.emailOtps || {};
      global.emailOtps[email] = {
        otp,
        expires: Date.now() + 10 * 60 * 1000
      };

      await sendEmail(email, otp);

      return res.status(200).json({
        message: "OTP sent to email"
      });
    }

    // ================= PHONE OTP =================
    if (!phone || !phoneSuffix) {
      return res.status(400).json({
        error: "phone and phoneSuffix required"
      });
    }

    const fullPhone = `${phoneSuffix}${phone}`;

    await twilioService.sendOtpPhoneNo(fullPhone);

    return res.status(200).json({
      message: "OTP sent to phone"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to send OTP"
    });
  }
};

// ================= VERIFY OTP =================
const verifyOtp = async (req, res) => {
  const { phone, phoneSuffix, email, otp } = req.body;

  try {

    let user;

    // ================= EMAIL VERIFY =================
    if (email) {
      const record = global.emailOtps?.[email];

      if (!record) {
        return res.status(400).json({
          error: "OTP not found"
        });
      }

      if (record.expires < Date.now()) {
        return res.status(400).json({
          error: "OTP expired"
        });
      }

      if (String(record.otp) !== String(otp)) {
        return res.status(400).json({
          error: "Invalid OTP"
        });
      }

      user = await userModel.verifyUserEmail(email);

      delete global.emailOtps[email];
    }

    // ================= PHONE VERIFY =================
    else {
      if (!phone || !phoneSuffix) {
        return res.status(400).json({
          error: "phone and suffix required"
        });
      }

      const fullPhone = `${phoneSuffix}${phone}`;

      const result = await twilioService.verifyOtp(fullPhone, otp);

      if (result.status !== "approved") {
        return res.status(400).json({
          error: "Invalid OTP"
        });
      }

      user = await userModel.verifyUserPhone(fullPhone);
    }

    const token = jwt.sign(
      {
        userId: user.id,
        phone: user.phone,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwttoken", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "OTP verified",
      user
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "OTP verification failed"
    });
  }
};
const checkAuthenticated = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await userModel.findUserById(userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    res.status(200).json({
      authenticated: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      error: "Internal server error"
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("jwttoken");

  return res.status(200).json({
    message: "Logged out successfully"
  });
};

module.exports = {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  checkAuthenticated,
  logout
};