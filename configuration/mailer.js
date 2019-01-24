const nodemailer = require('nodemailer');
const { MAILER_SERVICE, MAILER_PASSWORD, MAILER_USER} = require('./environment');

const transporter = nodemailer.createTransport({
    service: MAILER_SERVICE,
    auth: {
        user: MAILER_USER, // email
        pass: MAILER_PASSWORD // password
    }
});

module.exports = (formulaire) => {


    const mailOptions = {
        from: '"Site FunLab" <email',
        to: MAILER_USER, // email destinataire
        subject: formulaire.sujet,
        html: `
            <strong>Nom:</strong> ${formulaire.nom} <br/>
            <strong>E-mail:</strong> ${formulaire.email} <br/>
            <strong>Sujet:</strong> ${formulaire.sujet} <br/>
            <strong>Message:</strong> ${formulaire.message}`
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
}