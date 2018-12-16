const nodemailer = require('nodemailer');

module.exports = (formulaire) => {
 const transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
 user: '', // email
 pass: '' // password
 }
 });

const mailOptions = {
 from: '"Site FunLab" <email',
 to: '', // email destinataire
 subject: formulaire.sujet,
 html: `
 <strong>Nom:</strong> ${formulaire.nom} <br/>
 <strong>E-mail:</strong> ${formulaire.email} <br/>
 <strong>Sujet:</strong> ${formulaire.sujet} <br/>
 <strong>Message:</strong> ${formulaire.message}
 `
 };

transporter.sendMail(mailOptions, function (err, info) {
 if (err)
 console.log(err)
 else
 console.log(info);
 });
}