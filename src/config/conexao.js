const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'usuario',
    password: 'senha',
    database: 'meudatabase'
});

module.exports = conexao;