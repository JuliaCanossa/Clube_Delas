// src/models/usuarioModel.js

// "O usuarioModel tem duas funções: autenticar, que faz um SELECT para conferir e-mail e senha,
//  e cadastrar, que faz um INSERT na tabela de usuários. Usei ? nas queries para evitar SQL Injection. 
//  O model só acessa o banco: quem recebe a requisição e responde é o controller."

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