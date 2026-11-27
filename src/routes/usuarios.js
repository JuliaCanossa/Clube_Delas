// src/routes/usuarios.js
var express = require("express");
var router = express.Router();

// O que é uma rota?
// Uma rota é um endereço da sua API associado a uma ação. 
// Ela responde à pergunta: "quando alguém acessar este endereço 
// com este método, o que o servidor deve fazer?"
// Pense em um restaurante: o cardápio é o conjunto de rotas, 
// e cada prato é uma rota. O cliente (front-end) pede um prato 
// (faz a requisição) e a cozinha (controller) prepara e entrega.


// O require é a forma do Node.js de importar o código de outro arquivo para usar no arquivo atual.
// Cada arquivo em Node é isolado. Uma função criada em um arquivo não existe nos outros, 
// a não ser que você exporte de um lado e importe do outro.
var usuarioController = require("../controllers/usuarioController");
var habitoController = require("../controllers/habitoController");

//  usuário 
router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
});

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

// Nas rotas de usuário, como cadastro e login, utilizei o método POST, 
// porque o front-end envia dados sensíveis, como e-mail e senha, ao servidor. 
// No POST esses dados vão no corpo da requisição, e não na URL como no GET, 
// o que é mais seguro. O servidor então valida os dados e, no caso do cadastro, grava no banco.

//  hábitos 

// Nas rotas de hábitos, usei GET para consultar dados, como o catálogo de hábitos
//  e a lista de hábitos de cada usuário. Usei POST para as ações que alteram o banco: adicionar 
//  um hábito do catálogo, criar um hábito personalizado e marcar ou desmarcar um hábito como cumprido. 
//  Nas rotas que precisam identificar um registro, como listar e marcar, utilizei parâmetros na URL, 
//  como :idUsuario e :id. Todas apenas direcionam a requisição para o habitoController, que contém a 
//  lógica.

router.get("/habitos/catalogo", function (req, res) {
    habitoController.catalogo(req, res);
});

router.post("/habitos/adicionar", function (req, res) {
    habitoController.adicionar(req, res);
});

router.get("/habitos/listar/:idUsuario", function (req, res) {
    habitoController.listar(req, res);
});

router.post("/habitos/marcar/:id", function (req, res) {
    habitoController.marcar(req, res);
});

router.post("/habitos/desmarcar/:id", function (req, res) {
    habitoController.desmarcar(req, res);
});

router.post("/habitos/criar", function (req, res) {
    habitoController.criar(req, res);
});

//  dashboard 

// Devolve os dados do usuário agrupados por hábito (ex: quantas vezes cumpriu cada um)
router.get("/dashboard/habitos/:idUsuario", function (req, res) {
    habitoController.dashboardHabitos(req, res);
}); 

// Devolve os dados do usuário agrupados por dia (ex: quantos hábitos cumpriu em cada dia)
router.get("/dashboard/dias/:idUsuario", function (req, res) {
    habitoController.dashboardDias(req, res);
});

module.exports = router;