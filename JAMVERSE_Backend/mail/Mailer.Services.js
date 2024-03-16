const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST_URL,
    port: 465,
    secure: true, // upgrade later with STARTTLS
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD,
    },
});

module.exports = transporter;