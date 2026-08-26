import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'formmitra_jwt_secret_key_2026_india_voice2form';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      req.user = null;
      return next();
    }
    req.user = decoded;
    next();
  });
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please login.' });
  }
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'officer')) {
    return res.status(403).json({ success: false, message: 'Access denied. Administrative privileges required.' });
  }
  next();
}
