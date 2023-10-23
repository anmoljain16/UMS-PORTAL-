const express = require('express');
const { updatePersonalData, getDrives, getStudents } = require('../controllers/actionController');
const router = express.Router();

router.post('/updatePersonalData', updatePersonalData);
router.post('/getDrives', getDrives);
router.get('/getStudents', getStudents);

module.exports = router;
