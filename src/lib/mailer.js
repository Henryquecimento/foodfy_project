const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "0ae6a668806234",
    pass: "7caa65c92bfb7b"
  }
});