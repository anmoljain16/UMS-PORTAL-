const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// User registration
exports.register = async (req, res) => {
    try {
        const { regno, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            regno,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' });
    }
};

// User login
exports.login = async (req, res) => {
    try {
        const { regno, password } = req.body;
        // console.log(regno)
        const user = await User.findOne({ regno });



        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // console.log(user)
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("Logged IN")
        res.status(200).send({
            message: "Login Successful",
            regno : user.regno,
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
};
