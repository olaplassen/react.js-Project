

class MailService {

sendMail(recieverAdress, mailSubject, mailtext) {
let nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'badrgruppe22@gmail.com',
    pass: ''
  }
});
//definerer mail innhold
var mailOptions = {
  from: 'badrgruppe22@gmail.com',
  to: recieverAdress,
  subject: mailSubject,
  text: mailtext
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}
}
let mailService = new MailService();

export { mailService };
