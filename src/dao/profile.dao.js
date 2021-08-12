const conexao = require('../config/conexao.js');
const mailService = require('../services/mail.service.js');

class ProfileDao {

    insert(profile, res) {
        const sql = 'INSERT INTO PROFILE SET ?';

        conexao.query(sql, profile, (erro, resultados) => {
            if(erro) {
                res.status(400).json({mensagem: erro});
            } else {
                res.status(201).json(profile);
                mailService.sendEmail(profile.email, profile.codigoValidacao);
            }
        });
    }

    updateCodigoValidacao(profile, res) {
        const sql = 'UPDATE PROFILE SET `codigoValidacao` = ? WHERE `email` = ?';

        conexao.query(sql, [profile.codigoValidacao, profile.email], (erro, resultados) => {
            if(erro) {
                res.status(400).json({mensagem: erro});
            } else {
                res.status(200).json(profile);
                mailService.sendEmail(profile.email, profile.codigoValidacao);
            }
        });
    }

    selectByMail(profile) {
        const sql = 'SELECT email FROM PROFILE WHERE `email` = ?';

        return conexao.promise().query(sql, [profile.email]);
    }

    selectUserByMail(profile) {
        const sql = 'SELECT * FROM PROFILE WHERE `email` = ?';

        return conexao.promise().query(sql, [profile.email]);
    }

    buscarUsuarioPorId(id) {
        const sql = 'SELECT * FROM PROFILE WHERE `id` = ?';

        return conexao.promise().query(sql, [id]);
    }

    retirarPrimeiroLogin(profile) {
        const sql = 'UPDATE PROFILE SET `primeiroLogin` = 0 WHERE `email` = ?';

        return conexao.promise().query(sql, [profile.email]);
    }

    gerarCodValidacao(profile) {
        const sql = 'UPDATE PROFILE SET `codigoValidacao` = ? WHERE `email` = ?';

        return conexao.promise().query(sql, [profile.codigoValidacao, profile.email]);
    }

    validarCodigo(profile) {
        const sql = 'SELECT * FROM PROFILE WHERE `email` = ? AND `codigoValidacao` = ?';

        return conexao.promise().query(sql, [profile.email, profile.codigoValidacao]);
    }

    redefinirSenha(profile) {
        const sql = 'UPDATE PROFILE SET `senha` = ? WHERE `email` = ? and `codigoValidacao` = ?';

        return conexao.promise().query(sql, [profile.senha, profile.email, profile.codigoValidacao]);
    }

    atualizar(profile) {
        const sql = 'UPDATE PROFILE SET `tipoPix` = ?, `pix` = ? WHERE `id` = ? AND `email` = ?';

        return conexao.promise().query(sql, [profile.tipoPix, profile.pix, profile.id, profile.email]);
    }

    deletar(id) {
        const sql = 'DELETE FROM PROFILE WHERE `id` = ?';

        return conexao.promise().query(sql, id);
    }
}

module.exports = new ProfileDao();