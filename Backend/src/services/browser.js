const puppeteer = require('puppeteer');

let _page, _browser;

module.exports = {
    start: async () => {
        _browser = await puppeteer.launch({ headless: false });
        _page = await _browser.newPage();
        return _page;
    },

    stop: async (page) => {
        await page.close();
        await _browser.close();
    }
}
