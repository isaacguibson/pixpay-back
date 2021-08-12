const Profile = require('../models/profile.js');
const profileService = require('../services/profile.service.js');
const auth = require("../middleware/atuhtoken");
const jwt = require("jsonwebtoken");
const mailService = require('../services/mail.service.js');

module.exports = app => {

    app.post('/auth/signup', (req, res) => {
        const auth = req.body;
        let digit = '';
        for (let index = 0; index < 6; index++) {
            digit = digit + Math.floor(Math.random() * 10).toString();
        }

        perfil = profileService.bodyToProfile(auth);
        perfil.primeiroLogin = true;
        perfil.codigoValidacao = digit;
        profileService.saveProfile(perfil, res);
    });

    app.post('/auth/signin', (req, res) => {
        const auth = req.body;

        perfil = profileService.bodyToProfile(auth);
        profileService.login(perfil, res);
    });

    app.post('/auth/validarCodigo', (req, res) => {
        const auth = req.body;
        perfil = profileService.bodyToProfile(auth);
        profileService.validarCodigo(perfil, res);
    });

    app.get('/auth/verificarToken/:id', auth, (req, res) => {
        const id = req.params.id;
        let token = jwt.sign({ id }, process.env.SECRET,{
            expiresIn: "1h"
        }
        );
        res.status(200).json({token});
    });

    app.post('/auth/sendemail', (req, res) => {
        const auth = req.body;
        let digit = '';
        for (let index = 0; index < 6; index++) {
            digit = digit + Math.floor(Math.random() * 10).toString();
        }

        perfil = profileService.bodyToProfile(auth);
        perfil.primeiroLogin = true;
        perfil.codigoValidacao = digit;
        profileService.updateCodigoValidacao(perfil, res);
    });

    app.post('/auth/test', (req, res) => {
        res.status(200).json({mensagem: 'Tudo OK por aqui...'});
    });
    
}