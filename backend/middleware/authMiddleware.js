import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Accept auth via HttpOnly cookie OR Authorization: Bearer <token> header
export const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Fallback to Authorization header if cookie not present (useful for mobile WebView blocking cookies)
    if (!token) {
      const auth = req.headers?.authorization || '';
      if (auth.startsWith('Bearer ')) {
        token = auth.substring('Bearer '.length).trim();
      }
    }

    if (!token) return res.status(401).json({ error: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ error: 'User not found' });
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalid or expired' });
  }
};