
 // Klasse for å sende epost ved glemt passord.
class MailService {

  // Sender mail ved glemt passord og når en bruker blir kalt ut til vakt.
sendMail(recieverAdress, mailSubject, mailtext) {
let nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'badrgruppe22@gmail.com',
    pass: ''
  }
});
  // Definerer mail innhold
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
