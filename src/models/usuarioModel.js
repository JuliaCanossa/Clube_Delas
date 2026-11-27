// src/models/usuarioModel.js



var database = require("../database/config");

function autenticar(email, senha) {
    var instrucao = `
        SELECT id, nome, email
        FROM usuario
        WHERE email = ? AND senha = ?;
    `;
    return database.executar(instrucao, [email, senha]);
}

function cadastrar(nome, email, senha) {
    var instrucao = `
        INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?);
    `;
    return database.executar(instrucao, [nome, email, senha]);
}

module.exports = {
    autenticar,
    cadastrar
};
