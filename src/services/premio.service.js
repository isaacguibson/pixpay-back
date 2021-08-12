const premiosDao = require('../dao/premio.dao.js');
const Ganhador = require('../models/ganhador.js');
const Premio = require('../models/premio.js');

class PremioService {

    bodyToPremio(body) {
        let premio = new Premio();
        premio.premioId = body['premioId'];
        premio.valor = body['valor'];
        premio.ativo = body['ativo'];
        premio.usuarioId = body['usuarioId'];
        premio.dataAtivacao = body['dataAtivacao'];
        return premio;
    }

    obterPremios(res) {
        premiosDao.obterTodos().then(data => {
            let premios = [];
            for(let index = 0; index < data[0].length; index++) {
                let premio = new Premio();
                premio = this.bodyToPremio(data[0][index]);
                premios.push(premio);
            }
            res.status(200).json(premios);
        }).catch(erro => {
            res.status(400).json({mensagem: erro});
        })
    }

    resgatar(idUsuario, idPremio, res) {
        premiosDao.jaExisteGanhador(idPremio).then( data => {
            if(data[0].length > 0) {
                let existeUsuario = data[0][0].usuarioId;
                if(existeUsuario) {
                    res.status(400).json({mensagem: 'Desculpe, algum usuário já resgatou esse prêmio...'});
                    return;
                } else {
                    premiosDao.resgatar(idUsuario, idPremio).then(response => {
                        premiosDao.obtemValorPremio(idPremio).then(valor => {
                            let valorGanhado = valor[0][0].valor;
                            if(valor) {
                                let ganhador = new Ganhador();
                                ganhador.valor = valorGanhado;
                                ganhador.pago = false;
                                ganhador.usuarioId = idUsuario;
                                ganhador.dataPremio = new Date();
                                premiosDao.inserirGanhador(ganhador, res);
                            } else {
                                res.status(400).json({mensagem: 'Não foi possível resgatar esse prêmio'});
                                return;
                            }
                        }).catch(erro => {
                            res.status(400).json({mensagem: 'Não foi possível resgatar esse prêmio'});
                            return;
                        });
                    }).catch(err => {
                        res.status(400).json({mensagem: 'Não foi possível resgatar esse prêmio'});
                        return;
                    });
                }
            } else {
                res.status(400).json({mensagem: 'Não foi possível resgatar esse prêmio'});
                return;
            }
        }).catch(erro => {
            res.status(400).json({mensagem: 'Não foi possível resgatar esse prêmio'});
        });
    }

}

module.exports = new PremioService();