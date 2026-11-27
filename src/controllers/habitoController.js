// src/controllers/habitoController.js


var habitoModel = require("../models/habitoModel");


function responder(promessa, res, acao) {
    promessa
        .then(function (resultado) {
            res.json(resultado);
        })
     
        .catch(function (erro) {
            console.log("Erro ao " + acao + ":", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || "Erro interno");
        });
}


function catalogo(req, res) {
    responder(habitoModel.catalogo(), res, "buscar o catálogo");
}


function adicionar(req, res) {

    var idHabito = req.body.idHabitoServer;
    var idUsuario = req.body.idUsuarioServer;

    if (idHabito == undefined || idUsuario == undefined) {
        return res.status(400).send("idHabito ou idUsuario está undefined!");
    }
    responder(habitoModel.adicionar(idHabito, idUsuario), res, "adicionar hábito");
}


function listar(req, res) {
    responder(habitoModel.listar(req.params.idUsuario), res, "listar hábitos");
}


function marcar(req, res) {
    habitoModel.marcar(req.params.id)
       
        .then(function (resultado) { res.status(200).json(resultado); })
        .catch(function (erro) {
            console.log("Erro ao marcar:", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage);
        });
}


function desmarcar(req, res) {
    habitoModel.desmarcar(req.params.id)
        .then(function (resultado) { res.status(200).json(resultado); })
        .catch(function (erro) {
            console.log("Erro ao desmarcar:", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage);
        });
}


function dashboardHabitos(req, res) {
    responder(habitoModel.dashboardHabitos(req.params.idUsuario), res, "buscar dashboard de hábitos");
}


function dashboardDias(req, res) {
    responder(habitoModel.dashboardDias(req.params.idUsuario), res, "buscar dashboard por dia");
}

function criar(req, res) {
    var nome = req.body.nomeServer;
    var idUsuario = req.body.idUsuarioServer;


    if (nome == undefined || String(nome).trim() == "") {
        return res.status(400).send("O nome do hábito está vazio!");
    }
    if (idUsuario == undefined) {
        return res.status(400).send("idUsuario está undefined!");
    }

    responder(habitoModel.adicionarPorNome(String(nome).trim(), idUsuario), res, "criar hábito");
}

module.exports = {
    criar,
    catalogo,
    adicionar,
    listar,
    marcar,
    desmarcar,
    dashboardHabitos,
    dashboardDias
};
