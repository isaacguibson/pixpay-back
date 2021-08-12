const Premio = require('../models/premio.js');
const nodemailer = require('nodemailer');
const premioService = require('../services/premio.service.js');
const auth = require("../middleware/atuhtoken");

module.exports = app => {

    app.get('/premios', auth, (req, res) => {
        premios = premioService.obterPremios(res);
    });

    app.post('/premios/resgatar', (req, res) => {
        const resgate = req.body;
        let idUsuario = resgate['id_usuario'];
        let idPremio = resgate['id_premio'];

        premios = premioService.resgatar(idUsuario, idPremio, res);
    });
}