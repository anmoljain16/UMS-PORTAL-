
const browser = require('../services/browser');
const scraper = require('../services/scraper');

module.exports = {
    scrapeData: async (req, res) => {
        try {
            const page = await browser.start();

            await page.goto(URL);
            await page.authenticate(req.body);

            if (!await page.isAuthenticated()) {
                throw new Error('Authentication failed');
            }

            const data = await scraper.scrapePage(page);

            await browser.stop(page);

            res.status(200).json(data);

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Scrape failed' });
        }
    }
}
