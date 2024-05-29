import express from 'express'
import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();
const router = express.Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username }); // Find user by username
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send(token);
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
  });

  export default router