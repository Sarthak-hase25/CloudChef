const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { kitchen: true } // Fetch kitchen details with user
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, kitchenId: user.kitchenId, role: user.role },
      process.env.JWT_SECRET || 'cloudkitchen-ai-super-secret-key-2026',
      { expiresIn: '1d' }
    );

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Remove password from response
    delete user.passwordHash;

    res.json({
      message: 'Login successful',
      token,
      user
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { kitchen: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    delete user.passwordHash;
    res.json(user);
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  login,
  getMe
};
