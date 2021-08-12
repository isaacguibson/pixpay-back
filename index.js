const customExpress = require('./src/config/customExpress.js');
const conexao = require('./src/config/conexao');
const tabelas = require('./src/config/tabelas');
require('dotenv-safe').config();

conexao.connect(erro => {
    if(erro) {
        console.log(erro);
    } else {
        console.log('connectado com sucesso');
        tabelas.init(conexao);

        app = customExpress();
        app.listen(3000, () => console.log('Server running on port 3000'));
    }
});

