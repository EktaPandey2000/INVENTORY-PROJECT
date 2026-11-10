import 'dotenv/config';
import nodemailer from 'nodemailer';

console.log("Testing email with:", process.env.EMAIL_USER, process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER, // खुद को ही मेल भेज रहे हैं टेस्ट के लिए
  subject: 'Test Email',
  text: 'अगर यह मेल आपको मिला है, तो आपका Nodemailer पूरी तरह से काम कर रहा है!'
}).then(info => {
  console.log('✅ Email Sent Successfully!', info.response);
}).catch(err => {
  console.error('❌ Error:', err.message);
});