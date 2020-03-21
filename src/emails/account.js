const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SEND_API_KEY);
const sendWelcomeEmail = (email,name) => {
  const msg = {
    to:email,
    from:'vprasanna.vivek@gmail.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: `Welcome <strong>${name}</strong>`,
};
sgMail.send(msg);
}

const sendRemoveEmail = (email,name) => {
  console.log(email)
  const msg1 = {
    to:email,
    from:'vprasanna.vivek@gmail.com',
  subject: 'Account Removed',
   html: `Welcome <strong>${name}</strong> your account has beedn removed successfully`,
};
sgMail.send(msg1);
}

module.exports = {
  sendWelcomeEmail ,
  sendRemoveEmail
}


 

