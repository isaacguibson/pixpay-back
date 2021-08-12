const conexao = require('../config/conexao.js');

class PremioDao {

    obterTodos() {
        const sql = 'SELECT * FROM PREMIOS';

        return conexao.promise().query(sql);
    }

    resgatar(idUsuario, idPremio) {
        const sql = 'UPDATE PREMIOS SET `usuarioId` = ? WHERE `premioId` = ?';

        return conexao.promise().query(sql, [idUsuario, idPremio]);
    }

    inserirGanhador(ganhador, res) {
        const sql = 'INSERT INTO GANHADORES SET ?';
        conexao.query(sql, ganhador, (erro, resultados) => {
            if(erro) {
                res.status(400).json({mensagem: erro});
                return;
            } else {
                res.status(200).json({mensagem: 'Prêmio resgatado com sucesso'});
                return;
            }
        });
    }
    
    jaExisteGanhador(premioId) {
        const sql = 'SELECT usuarioId FROM PREMIOS WHERE `premioId` = ?';

        return conexao.promise().query(sql, premioId);
    }

    obtemValorPremio(premioId) {
        const sql = 'SELECT valor FROM PREMIOS WHERE `premioId` = ?';

        return conexao.promise().query(sql, premioId);
    }

    deletarPremiosDoUsuario(id) {
        const sql = 'DELETE FROM PREMIOS WHERE `usuarioId` = ?';

        return conexao.promise().query(sql, id);
    }

}

module.exports = new PremioDao();