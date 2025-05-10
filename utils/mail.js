const nodemailer = require("nodemailer");
require('dotenv').config();
const email = process.env.EMAILOFSENDER;
const pass = process.env.PASSKEY



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: email,
    pass: pass,
  },
});

async function sendEmail({ userEmail, otp }) {
  await transporter.sendMail({
    from: '"Verification Team" <danishpathan7477@gmail.com>',
    to: userEmail,
    subject: "OTP Verification",
    text: `Your OTP code is ${otp}`,
    html: `<p>Your OTP code is <b>${otp}</b>. It is valid for 10 minutes.</p>`,
  });
}

async function sendEmailforNewFollow({ userEmail, followedBy }) {
  await transporter.sendMail({
    from: '"Verification Team" <danishpathan7477@gmail.com>',
    to: userEmail,
    subject: "New Notification from CampusMedia",
    text: `you are followed by ${followedBy}`,
    html: `<p>you are followed by<b>${followedBy}`,
  });
}


module.exports = { sendEmail, sendEmailforNewFollow };
