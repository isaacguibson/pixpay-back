const bcrypt = require ('bcrypt');
const salt = bcrypt.genSaltSync(10);
const profile = require('../controllers/profile.js');
const Profile = require('../models/profile.js');
const mailService = require('../services/mail.service.js');
const profileDao = require('../dao/profile.dao.js');
const premioDao = require('../dao/premio.dao.js');
const ganhadorDao = require('../dao/ganhador.dao.js');
const jwt = require("jsonwebtoken");

class ProfileService {

    bodyToProfile(body) {

        let profile = new Profile();
        if(body['id']) profile.id = body['id'];
        if(body['email']) profile.email = body['email'];
        if(body['senha']) profile.senha = body['senha'];
        if(body['tipoPix']) profile.tipoPix = body['tipoPix'];
        if(body['pix']) profile.pix = body['pix'];
        if(body['token']) profile.token = body['token'];
        if(body['primeiroLogin']) profile.primeiroLogin = body['primeiroLogin'];
        if(body['codigoValidacao']) profile.codigoValidacao = body['codigoValidacao'];

        return profile;
    }

    saveProfile(profile, res) {
        //Criptografia de Senha
        profile.senha = bcrypt.hashSync(profile.senha, salt);

        profileDao.selectByMail(profile).then( data => {
            if(data[0].length > 0) {
                let email = data[0][0].email;
                res.status(400).json({mensagem: 'Já existe um usuário cadastrado com esse e-mail: '+email});
                return;
            } else {
                profileDao.insert(profile, res);
            }
        }).catch(erro => {
            res.status(400).json({mensagem: 'Não foi possível checar o e-mail informado'});
        });
    }

    updateCodigoValidacao(profile, res) {

        profileDao.updateCodigoValidacao(profile, res);
    }

    login(profile, res) {
        profileDao.selectUserByMail(profile).then( data => {
            if(data[0].length > 0) {
                let senha = data[0][0].senha;
                bcrypt.compare(profile.senha, senha, function(err, result) {
                    if(result) {
                        let id = data[0][0].id;
                        data[0][0]['primeiroLogin'] = data[0][0]['primeiroLogin'] > 0 ? true : false;
                        let token = jwt.sign({ id }, process.env.SECRET,{
                                expiresIn: "1h"
                            }
                        );
                        data[0][0]['token'] = token;
                        res.status(200).json(data[0][0]);
                        return;
                    } else {
                        res.status(400).json({mensagem: 'E-mail ou senha inválidos'});
                        return;
                    }
                });
            } else {
                res.status(400).json({mensagem: 'E-mail ou senha inválidos'});
                return;
            }
        }).catch(erro => {
            res.status(400).json({mensagem: 'Não foi possível realizar o login, tente novamente mais tarde'});
        });
    }

    validarCodigo(profile, res) {
        profileDao.validarCodigo(profile).then(data => {
            let codValidacao = data[0][0].codigoValidacao;
            profile = data[0][0];
            if(codValidacao === profile.codigoValidacao) {
                let id = profile.id;
                let token = jwt.sign({ id }, process.env.SECRET,{
                    expiresIn: "1h"
                    }
                );
                profile.token = token;
                profileDao.retirarPrimeiroLogin(profile).then(data2 => {
                    res.status(200).json(profile);
                    return;
                }).catch(erro => {
                    console.log(erro);
                    res.status(400).json({mensagem: 'Não foi possível validar esse código'});
                    return;
                });
            } else {
                res.status(400).json({mensagem: 'Código inválido, tente novamente'});
                return;
            }
        }).catch(erro => {
            res.status(400).json({mensagem: erro});
        })
    }

    gerarCodValidacao(profile, res) {
        profileDao.selectByMail(profile).then( data => {
            if(data[0].length > 0) {
                profileDao.gerarCodValidacao(profile).then(resulta => {
                    res.status(200).json({mensagem: 'Código de validação enviado para: '+ profile.email});
                    mailService.sendEmail(profile.email, profile.codigoValidacao);
                    return;
                }).catch(err => {
                    res.status(400).json({mensagem: 'Não foi possível gerar um código de validação'});
                    return;
                });
            } else {
                res.status(400).json({mensagem: 'Nenhum usuário encontrado para esse e-mail'});
                return;
            }
        }).catch(erro => {
            res.status(400).json({mensagem: 'Não foi possível checar o e-mail informado'});
        });
    }

    redefinirSenha(profile, res) {
        profileDao.redefinirSenha(profile).then(data => {
            res.status(200).json({mensagem: 'Senha redefinida'});
            return;
        }).catch(err => {
            res.status(400).json({mensagem: 'Não foi possível redefinir a senha'});
            return;
        });
    }

    buscarUsuarioPorId(id, res) {
        profileDao.buscarUsuarioPorId(id).then( data => {
            if(data[0].length > 0) {
                res.status(200).json(data[0][0]);
                return;
            } else {
                res.status(400).json({mensagem: 'Usuário não encontrado'});
                return;
            }
        }).catch(err => {
            console.log(err);
            res.status(400).json({mensagem: 'Não foi possível buscar esse usuário'});
            return;
        });
    }

    atualizar(profile, res) {
        profileDao.atualizar(profile).then(data => {
            res.status(200).json(profile);
            return;
        }).catch(err => {
            res.status(400).json({mensagem: 'Não foi possível atualizar'});
            return;
        });
    }

    deletar(id, res) {
        premioDao.deletarPremiosDoUsuario(id).then(deleteRes => {
            ganhadorDao.deletarGanhador(id).then(ganhadorRes => {
                profileDao.deletar(id).then(profileRes => {
                    res.status(200).json({mensagem: 'Usuario deletado com sucesso'});
                    return;
                }).catch(err => {
                    res.status(400).json({mensagem: 'Não foi possível deletar'});
                    return;
                });
            }).catch(err => {
                res.status(400).json({mensagem: 'Não foi possível deletar'});
                return;
            });
        }).catch(err => {
            res.status(400).json({mensagem: 'Não foi possível deletar'});
            return;
        });
    }

    obterGanhadores(res) {
        ganhadorDao.obterGanhadores().then(dados => {
            res.status(200).json(dados[0]);
        }).catch(err => {
            res.status(400).json({mensagem: 'Não foi possível obter os ganhadores'});
        });
    }

}

module.exports = new ProfileService();