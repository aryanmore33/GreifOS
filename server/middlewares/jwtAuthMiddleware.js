const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
  let token = null;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  }

  if (!token && req.cookies && req.cookies.jwttoken) {
    token = req.cookies.jwttoken;
  }

  if (!token) {
    return res.status(401).json({
      error: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired. Please login again.'
      });
    }

    return res.status(401).json({
      error: 'Invalid token'
    });
  }
};

const ownerOnly = (req, res, next) => {
  if (req.user.role !== 'owner') {
    return res.status(403).json({
      error: "Owner access only"
    });
  }
  next();
};

const nomineeOnly = (req, res, next) => {
  if (req.user.role !== 'nominee') {
    return res.status(403).json({
      error: "Nominee access only"
    });
  }
  next();
};

module.exports = {
  jwtAuthMiddleware,
  ownerOnly,
  nomineeOnly
};