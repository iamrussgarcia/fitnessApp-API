const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const auth = require('../auth.js');

module.exports.registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (typeof email !== 'string' || !email.includes('@')) {
            return res.status(400).send({ error: 'Email invalid' });
        }
        if (typeof password !== 'string' || password.length < 8) {
            return res.status(400).send({ error: 'Password must be at least 8 characters' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).send({ error: 'Email already registered' });
        }

        await new User({ email, password: bcrypt.hashSync(password, 10) }).save();
        return res.status(201).send({ message: 'Registered Successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: 'Error in saving user' });
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (typeof email !== 'string' || !email.includes('@')) {
            return res.status(400).send({ error: 'Invalid Email' });
        }
        if (typeof password !== 'string') {
            return res.status(400).send({ error: 'Password is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: 'No Email Found' });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).send({ error: 'Email and password do not match' });
        }

        return res.status(200).send({ access: auth.createAccessToken(user) });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: 'Error in login' });
    }
};

module.exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        return res.status(200).send({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: 'Failed to fetch user profile' });
    }
};
