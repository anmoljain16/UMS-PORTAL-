const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// User registration
exports.updatePersonalData = async (req, res) => {
    try {
        const { regno, data } = req.body;
        console.log(regno)
        const existingUser = await User.findOne({regno});
        const existingDrives = existingUser.drives;

// Extract existing jobProfile urls
        const existingUrls = existingDrives.map(d => d.jobProfile);

// Filter newDrives to only ones with new jobProfile
        const newDrives = data.driveData.filter(newDrive => {
            return !existingUrls.includes(newDrive.jobProfile);
        });

// Concat with existing drives
        const updatedDrives = [...existingDrives, ...newDrives];

        const result = await User.updateOne({ regno: regno }, { personalData: data.personalInfo.infoObject, drives: updatedDrives, recentPlaced: data.recentPlaced });

        if (result.nModified === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(201).json({ message: 'User data updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};



exports.getDrives = async (req, res) => {
    try {
        const { regno }= req.body;
        console.log(regno)

        const user = await User.findOne({ regno: regno });


        // console.log(user.password)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // console.log(user)
        const drives =user.drives;

        res.status(201).json({ drives});
    } catch (error) {
        res.status(500).json({ error: 'failed to update user ' });
    }
};


exports.getStudents = async (req, res) => {
    try {
        const { regno }= req.body;
        console.log(regno)

        const user = await User.findOne({ regno: regno });

        // console.log(user.password)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const data = user.data;
        const students = data.recentPlaced;

        res.status(201).json({ students});
    } catch (error) {
        res.status(500).json({ error: 'failed to get Students ' });
    }
}
