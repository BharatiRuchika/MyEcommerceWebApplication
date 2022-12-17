const nodemailer = require("nodemailer");

// SMTP_HOST = smtp.mailtrap.io
// SMTP_PORT = 2525
// SMTP_EMAIL = 4fea191d3ed5bc
// SMTP_PASSWORD = 8f81ebca462674
const sendMail = async options=>{
    var transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD
        }
      });
      const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    await transporter.sendMail(message)
}
module.exports=sendMail;