const conexao = require('../config/conexao.js');

class GanhadorDao {

    deletarGanhador(id) {
        const sql = 'DELETE FROM GANHADORES WHERE `usuarioId` = ?';

        return conexao.promise().query(sql, id);
    }

    obterGanhadores() {
        const sql = 'SELECT PROFILE.email,' +
                    ' PROFILE.tipoPix,' +
                    ' PROFILE.pix,' +
                    ' GANHADORES.VALOR,' +
                    ' GANHADORES.dataPremio,' +
                    ' GANHADORES.pago' +
                    ' FROM GANHADORES INNER JOIN PROFILE' +
                    ' ON GANHADORES.usuarioId = PROFILE.id' +
                    ' WHERE GANHADORES.dataPremio <= sysdate()' +
                    ' AND GANHADORES.dataPremio > DATE_SUB(sysdate(), INTERVAL 15 DAY)';

        return conexao.promise().query(sql);
    }
    
}

module.exports = new GanhadorDao();