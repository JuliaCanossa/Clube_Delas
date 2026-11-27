// src/database/config.js

// "O config.js é o arquivo de conexão com o banco. Usei a biblioteca mysql2 com um pool de conexões, 
// que mantém até 10 conexões prontas para serem reaproveitadas, o que é mais eficiente do que abrir 
// uma a cada requisição. Os dados de acesso vêm de variáveis de ambiente (process.env), então o mesmo 
// código usa o banco local em desenvolvimento e o remoto em produção, e a senha não fica exposta no 
// código. A função executar roda o SQL e devolve uma Promise, para os models e controllers usarem 
// .then e .catch."

const mysql = require("mysql2");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10
});

// executar(instrucao)            -> SQL simples
// executar(instrucao, [valores]) -> SQL com ? (parametrizado)
function executar(instrucao, valores) {
    return new Promise(function (resolve, reject) {
        pool.query(instrucao, valores, function (erro, resultados) {
            if (erro) {
                console.log("ERRO NO MySQL:", erro.sqlMessage || erro.message);
                return reject(erro);
            }
            resolve(resultados);
        });
    });
}

module.exports = {
    executar
};