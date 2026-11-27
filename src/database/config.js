// src/database/config.js

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
