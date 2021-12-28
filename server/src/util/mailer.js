const nodemailer = require("nodemailer");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, '../private/.env') });

const smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "taskboardmail@gmail.com",
        password: process.env.EMAIL_PASSWORD,
    }
});

module.exports = smtpTransport;
