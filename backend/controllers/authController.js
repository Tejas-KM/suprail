// Get current user info
export const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const { _id, email, name } = req.user;
  res.status(200).json({ user: { id: _id, email, name } });
};
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'User already exists' });

    const user = await User.create({ email, password, name });
    const token = createToken(user);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      // For cross-site cookies (frontend on different domain) use 'none' in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie('token', token, cookieOptions);

    res.status(201).json({ user: { id: user._id, email, name } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = createToken(user);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Lax',
      // 180 days for rememberMe, else 7 days default
      maxAge: (String(rememberMe) === 'true' || rememberMe === true)
        ? 180 * 24 * 60 * 60 * 1000
        : 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie('token', token, cookieOptions);

    // Also return token in body for mobile WebView fallback (Authorization header)
    res.status(200).json({ user: { id: user._id, email, name: user.name }, token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const logout = (req, res) => {
  // Clear cookie with same options used to set it (some browsers require this)
  res.clearCookie('token', {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Lax',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};