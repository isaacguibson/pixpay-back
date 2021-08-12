const nodemailer = require('nodemailer');

class MailService {

    sendEmail(email, digits) {
        const appEmail = 'seu_email';
        const appEmailPass = 'sua_senha';

        // Envio de email
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
            user: appEmail,
            pass: appEmailPass
            }
        });

        let mailOptions = {
            from: appEmail,
            to: email,
            subject: 'PixPay - Código de Confirmação',
            text: 'Atenção, foi gerado um código de confirmação no PixPay para seu e-mail. \n' +
                'Seu código de confirmação é: ' + digits + '\n' +
                'Caso não tenha sido você, basta ignorar essa mensagem.'
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

module.exports = new MailService();