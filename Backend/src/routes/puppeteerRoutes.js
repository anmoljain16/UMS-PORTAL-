const express = require('express');
const { fetchData } = require('../controllers/puppeteerController');
const {scrapeData} = require('../controllers/scrape')
const router = express.Router();

router.post('/fetchData', fetchData);
router.post('/fetchDatas', scrapeData);


module.exports = router;
