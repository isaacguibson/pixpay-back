const Profile = require('../models/profile.js');
const profileService = require('../services/profile.service.js');
const nodemailer = require('nodemailer');
const auth = require("../middleware/atuhtoken");

module.exports = app => {

    app.get('/profile/:id', auth, (req, res) => {
        const id = req.params.id;

        if(!id || id == '') {
            res.status(400).json({mensagem: 'Hmmm, parece que este usuário não é compatível.'});
        } else {
            profileService.buscarUsuarioPorId(id, res);
        }

    });

    app.post('/profile/gerarCodValidacao', (req, res) => {
        const email = req.body['email'];
        let digit = '';
        
        for (let index = 0; index < 6; index++) {
            digit = digit + Math.floor(Math.random() * 10).toString();
        }

        let profile = new Profile();
        profile.email = email;
        profile.codigoValidacao = digit;
        profileService.gerarCodValidacao(profile, res);
    });

    app.post('/profile/redefinirSenha', (req, res) => {
        const email = req.body['email'];
        const codigoValidacao = req.body['codigoValidacao'];
        const senha = req.body['senha'];

        let profile = new Profile();
        profile.email = email;
        profile.codigoValidacao = codigoValidacao;
        profile.senha = senha;
        profileService.redefinirSenha(profile, res);
    });

    app.put('/profile', auth, (req, res) => {
        const id = req.body['id'];
        const email = req.body['email'];
        const tipoPix = req.body['tipoPix'];
        const pix = req.body['pix'];

        let profile = new Profile();
        profile.id = id;
        profile.email = email;
        profile.tipoPix = tipoPix
        profile.pix = pix;
        profileService.atualizar(profile, res);
    });

    app.delete('/profile/deletar/:id', auth, (req, res) => {
        const id = req.params.id;

        profileService.deletar(id, res);
    });
}