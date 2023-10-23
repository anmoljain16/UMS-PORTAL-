const express = require('express');
const dotenv = require('dotenv');

const connectDB = require('./src/utils/db');
const authRoutes = require('./src/routes/authRoutes');
const actionRoutes = require('./src/routes/actionRoutes');
const puppeteerRoutes = require('./src/routes/puppeteerRoutes');
try{
    dotenv.config();
}catch (e) {

    console.log("Error while connecting to Env file : ", e)
}
connectDB();
let browser;
let page;

const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next()
});

app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/action', actionRoutes);
app.use('/api/puppeteer', puppeteerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
