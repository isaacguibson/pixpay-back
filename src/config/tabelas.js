const Premio = require('../models/premio.js');

class Tabelas {
    init (conexao) {
        this.conexao = conexao;
        this.primeiroReset();
        this.criarAtendimentos();
        this.criarPremios();
        this.criarGanhadores();
        this.iniciarJobReset();
        this.iniciarJobAtivacao();
    }

    iniciarJobReset() {
        const CronJob = require('cron').CronJob;
        const job = new CronJob('0 0 0 * * *', () => {
            this.resetarPremios();
        }, null, true, 'America/Sao_Paulo');
    }

    iniciarJobAtivacao() {
        const CronJob = require('cron').CronJob;
        const job = new CronJob('0 * * * * *', () => {
            this.ativarPremios();
        }, null, true, 'America/Sao_Paulo');
    }

    ativarPremios() {
        const sql = 'UPDATE PREMIOS SET `ativo` = 1 WHERE `dataAtivacao` < SYSDATE()';
        this.conexao.query(sql, (erro) => {
            if(erro) {
                console.log(erro);
            }
        });
    }

    primeiroReset() {

        const countSelect = 'SELECT COUNT(*) as RESULTADO FROM PREMIOS';

        this.conexao.query(countSelect, (erro, resultado) => {
            if(erro){
                console.log(erro);
            } else {
                if(resultado[0]['RESULTADO'] == 0){
                    this.inserirPremios();
                }
            }
        });
    }

    resetarPremios() {

        let hoje = new Date();
        //Reset apenas aos domingos
        if(hoje.getDay() != 0) {
            return;
        }

        const sql = 'DELETE FROM PREMIOS';

        this.conexao.query(sql, (erro) => {
            if(erro) {
                console.log(erro);
            } else {
                console.log('Premios Resetados');
                this.inserirPremios();
            }
        });
    }

    inserirPremios() {
        let valores = this.gerarValores();

        let hoje = new Date();

        console.log('inserindo premios');
        for(var index = 0; index < valores.length; index++) {
            var premio = new Premio();
            premio.valor = valores[index];
            premio.ativo = false;
            premio.usuarioId = null;
            premio.dataAtivacao = this.dataAleatoriaNaSemanaCorrente();

            if(premio.dataAtivacao.getTime() <= hoje.getTime()) {
                premio.ativo = true;
            }

            const sql = 'INSERT INTO PREMIOS SET ?';

            this.conexao.query(sql, premio, (erro, resultados) => {
                if(erro) {
                    console.log(erro)
                } else {
                    console.log('premio inserido');
                }
            });
        }
    }

    dataAleatoriaNaSemanaCorrente() {
        let now = new Date();
        let diaAtual = now.getDate();
        let mesAtual = now.getMonth();
        let anoAtual = now.getFullYear();
        return this.gerarDataNaSemana(diaAtual, mesAtual, anoAtual);
    }

    // Dia atual sempre deve ser um domingo
    gerarDataNaSemana(diaAtual, mesAtual, anoAtual) {

        let meses31Dias = [0, 2, 4, 6, 7, 9, 11];
        let meses30Dias = [3, 5, 8, 10];

        let incrementoDia = Math.floor(Math.random() * 7);

        let diaGerado = diaAtual + incrementoDia;
        let mesGerado = mesAtual;
        let anoGerado = anoAtual;

        if(meses30Dias.includes(mesAtual)) {
            if(diaGerado > 30) {
                diaGerado = diaGerado - 30;
                mesGerado = mesAtual + 1;
            }
        } else if (meses31Dias.includes(mesAtual)) {
            if(diaGerado > 31) {
                diaGerado = diaGerado - 31;
                mesGerado = mesAtual + 1;
                // Se for dezembro incromentar o ano
                if(mesGerado > 11) {
                    mesGerado = 0;
                    anoGerado = anoGerado + 1;
                }
            }
        } else { //Se for em Fevereiro
            if(this.isAnoBisiesto(anoAtual)) {
                if(diaGerado > 29) {
                    diaGerado = diaGerado - 29;
                    mesGerado = mesAtual + 1;
                }
            } else {
                if(diaGerado > 28) {
                    diaGerado = diaGerado - 28;
                    mesGerado = mesAtual + 1;
                }
            }
        }

        let horaGerada = Math.floor(Math.random() * 24);
        let minutoGerado = Math.floor(Math.random() * 60);
        let segundoGerado = Math.floor(Math.random() * 60);

        let dataGerada = new Date(anoGerado, mesGerado, diaGerado, horaGerada, minutoGerado, segundoGerado);
        return dataGerada;
    }

    isAnoBisiesto(ano) {
        if(ano%400 == 0) {
            return true;
        } else if (ano%4 == 0 && ano%100 != 0) {
            return true;
        } else {
            return false;
        }
    }

    gerarValores() {
        var valores = [];

        for(var i = 0; i < 3; i++) {
            let valor = Math.floor(Math.random() * 100) + 1;
            if(valor < 60) {
                valores.push(5);
            } else {
                valores.push(5);
            }
        }

        for(i = 0; i < 2; i++) {
            let valor = Math.floor(Math.random() * 100) + 1;
            if(valor < 70) {
                valores.push(10);
            } else {
                valores.push(15);
            }
        }

        return valores;
    }

    criarAtendimentos() {
        const sql = 'CREATE TABLE IF NOT EXISTS PROFILE (id int NOT NULL AUTO_INCREMENT, email varchar(255) NOT NULL, senha varchar(255) NOT NULL, tipoPix int NOT NULL, pix varchar(255) NOT NULL, token varchar(255), primeiroLogin boolean NOT NULL, codigoValidacao varchar(6) NOT NULL, PRIMARY KEY(id))'
        this.conexao.query(sql, (erro) => {
            if(erro) {
                console.log(erro);
            } else {
                console.log('Tabela profiles criada com sucesso');
            }
        });
    }

    criarPremios() {
        const sql = 'CREATE TABLE IF NOT EXISTS PREMIOS (premioId int NOT NULL AUTO_INCREMENT, valor int NOT NULL, ativo boolean NOT NULL, usuarioId int, dataAtivacao DATETIME NOT NULL, PRIMARY KEY(premioId), FOREIGN KEY (usuarioId) REFERENCES PROFILE(id))'
        this.conexao.query(sql, (erro) => {
            if(erro) {
                console.log(erro);
            } else {
                console.log('Tabela premios criada com sucesso');
            }
        });
    }

    criarGanhadores() {
        const sql = 'CREATE TABLE IF NOT EXISTS GANHADORES (ganhadorId int NOT NULL AUTO_INCREMENT, valor int NOT NULL, pago boolean NOT NULL, usuarioId int, dataPremio DATETIME NOT NULL, PRIMARY KEY(ganhadorId), FOREIGN KEY (usuarioId) REFERENCES PROFILE(id))'
        this.conexao.query(sql, (erro) => {
            if(erro) {
                console.log(erro);
            } else {
                console.log('Tabela ganhadores criada com sucesso');
            }
        });
    }
}

module.exports = new Tabelas;