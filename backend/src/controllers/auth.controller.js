const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.register = async (req, res) => {
  try {
    const { username, email, password, role , department, active } = req.body;

    const existingUser = await User.getUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create(username, email, hashedPassword, role, department, active);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.getUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

    await User.updateLastLogin(user.id);

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1d' }
    );

    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};

exports.getAllUser = async (req, res)=>{
  try {
    const response = await User.getAllUser();
    res.status(200).json({status: true, message:response})
  }
  catch (e) {
    res.status(500).json({ message: 'Server Error', e });
  }
}

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  try {
    const updatedUser = await User.updateUserById(id, updates);
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedUser = await User.deleteUserById(id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted', user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error });
  }
};