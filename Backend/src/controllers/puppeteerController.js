const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const puppeteer = require('puppeteer');
let browser;
let page;

exports.fetchData = async (req, res) => {
    try {
        const { regno, password } = req.body;
        console.log("trying to log in");
        browser = await puppeteer.launch({ headless: false });
        page = await browser.newPage();

        await page.goto('https://ums.lpu.in/Placements/');
        await page.screenshot({path:"portal.png"})
        let title = await page.title()
        if(title === "Placement Portal Login"){
            await page.type('#txtUserName', regno, {delay:100});
            await page.type('#txtPassword', password, {delay:100});
            await page.click('#Button1');

        }


        title = (await page.title()) ;
        await page.waitForSelector('#ctl00_ContentPlaceHolder1_rptMyProfile_ctl00_gvPicture_ctl02_ImageStudentPicture')

        if(title === "Student Home"){
            await page.screenshot({path:"loggedin.png"})
            console.log("Logged in successfully");

            const data = await getData();
            const fin = updatePersonalData(regno, data);
            res.status(200).json({server: fin})


        }else{
            console.log("login failed, try again");
            await browser.close();
            res.status(404).json({ loginSuccess: false })
        }

    } catch (error) {
        console.log("Error while login:", error);
        await browser.close();
        return false;

    }



}

const getData = async () => {

    let personalInfo = await page.evaluate(() => {
        const liElements = Array.from(document.querySelectorAll('ul.personal-info li'));
        const infoObject = {};
        liElements.forEach(li => {
            const label = li.querySelector('label').textContent.trim();
            const span = li.querySelector('span').textContent.trim();

            infoObject[label] = span;
        });
        return {infoObject}
    });

    let driveData = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('#ctl00_ContentPlaceHolder1_gdvPlacement tr.tabel_grid_white, #ctl00_ContentPlaceHolder1_gdvPlacement tr.tabel_grid_gray'));

        return rows.map(row => {
            const tds = row.querySelectorAll('td');
            const jobProfileLink = tds[3].querySelector('a.reg-btn');

            let jobProfileURL = '';
            if (jobProfileLink) {
                const href = jobProfileLink.getAttribute('href');
                const baseURI = window.location.origin;
                const baseURL = baseURI + '/Placements/';
                jobProfileURL = new URL(href, baseURL).href;
            }

            return {
                driveDate: tds[0].textContent.trim(),
                registerBy: tds[1].textContent.trim(),
                company: tds[2].textContent.trim(),
                jobProfile: jobProfileURL,
                status: tds[4].textContent.trim(),
                registered: tds[5].textContent.trim(),
                hallTicket: tds[6].querySelector('a.reg-btn') ? tds[6].querySelector('a.reg-btn').getAttribute('href') : ''
            };
        });
    });

    const recentPlaced = await page.evaluate(() => {
        const tables = Array.from(document.querySelectorAll('table#main_table'));
        const data = [];

        for (const table of tables) {
            const rows = Array.from(table.querySelectorAll('tbody tr'));

            if (rows.length >= 2) {
                const imgRow = rows[0];
                const dataRow = rows[1];

                const imgCell = imgRow.querySelector('td');
                const imageSrc = imgCell.querySelector('img') ? imgCell.querySelector('img').src : '';

                const tds = dataRow.querySelectorAll('td');
                const name = tds[0].textContent.trim();
                const regNo = tds[1].textContent.trim();
                const placedIn = tds[3].textContent.trim();

                data.push({
                    imageSrc,
                    name,
                    regNo,
                    placedIn
                });
            }
        }

        return data;
    });


    await browser.close();

    return {"personalInfo":personalInfo, "driveData": driveData, "recentPlaced": recentPlaced};
}


const updatePersonalData = async (regno, data) => {
    try {
        // const { regno, data } = req.body;
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
            return "user not found";
        }

        return "user updated succesfully";
    } catch (error) {
        return "Failed to update user";
    }
};


