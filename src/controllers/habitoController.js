// src/controllers/habitoController.js

// Importa o habitoModel, que é quem conversa com o banco de dados.
// O controller (este arquivo) recebe o pedido da tela, confere os dados
// e pede para o model buscar ou salvar no banco.
var habitoModel = require("../models/habitoModel");

// ---------- FUNÇÃO AJUDANTE ----------
// Várias funções abaixo faziam o mesmo trecho (.then / .catch),
// então ele foi guardado aqui para não repetir código.
// promessa = o pedido feito ao banco (que ainda vai responder)
// res      = a resposta que vamos devolver para a tela
// acao     = texto que descreve o que estava sendo feito (usado na mensagem de erro)
function responder(promessa, res, acao) {
    promessa
        // Quando o banco responder certo, devolve o resultado para a tela
        .then(function (resultado) {
            res.json(resultado);
        })
        // Se der erro, mostra no terminal e avisa a tela com status 500 (erro no servidor).
        // "erro.sqlMessage || erro" = usa a mensagem do banco; se não tiver, usa o próprio erro.
        .catch(function (erro) {
            console.log("Erro ao " + acao + ":", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || "Erro interno");
        });
}

// ---------- CATÁLOGO ----------
// Busca a lista de hábitos prontos que a usuária pode escolher.
// Não precisa receber nada da tela.
function catalogo(req, res) {
    responder(habitoModel.catalogo(), res, "buscar o catálogo");
}

// ---------- ADICIONAR ----------
// Liga um hábito do catálogo a uma usuária.
function adicionar(req, res) {
    // Pega os dois ids que a tela enviou dentro do "corpo" (body) do pedido
    var idHabito = req.body.idHabitoServer;
    var idUsuario = req.body.idUsuarioServer;

    // Se faltar algum, responde status 400 ("pedido errado") e para por aqui.
    // O "||" significa "ou": basta um dos dois estar undefined (vazio).
    if (idHabito == undefined || idUsuario == undefined) {
        return res.status(400).send("idHabito ou idUsuario está undefined!");
    }
    // Se está tudo certo, pede ao model para salvar
    responder(habitoModel.adicionar(idHabito, idUsuario), res, "adicionar hábito");
}

// ---------- LISTAR ----------
// Lista os hábitos de uma usuária.
// Aqui o id vem no endereço (req.params), por exemplo /listar/5, e não no body.
function listar(req, res) {
    responder(habitoModel.listar(req.params.idUsuario), res, "listar hábitos");
}

// ---------- MARCAR ----------
// Marca um hábito como feito (o "check" do checklist diário).
// O id do registro vem no endereço (req.params.id).
// Esta função não usa a função "responder": faz o .then e o .catch por conta própria.
function marcar(req, res) {
    habitoModel.marcar(req.params.id)
        // Deu certo: responde status 200 ("tudo certo") com o resultado
        .then(function (resultado) { res.status(200).json(resultado); })
        // Deu erro: mostra no terminal e avisa a tela com status 500
        .catch(function (erro) {
            console.log("Erro ao marcar:", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage);
        });
}

// ---------- DESMARCAR ----------
// O contrário de marcar: tira o "check" do hábito.
function desmarcar(req, res) {
    habitoModel.desmarcar(req.params.id)
        .then(function (resultado) { res.status(200).json(resultado); })
        .catch(function (erro) {
            console.log("Erro ao desmarcar:", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage);
        });
}

// ---------- DASHBOARD ----------
// Busca os dados do gráfico "por hábito" de uma usuária.
function dashboardHabitos(req, res) {
    responder(habitoModel.dashboardHabitos(req.params.idUsuario), res, "buscar dashboard de hábitos");
}

// Busca os dados do gráfico "por dia" de uma usuária.
function dashboardDias(req, res) {
    responder(habitoModel.dashboardDias(req.params.idUsuario), res, "buscar dashboard por dia");
}

// ---------- CRIAR ----------
// Cria um hábito novo, com o nome que a usuária digitou.
function criar(req, res) {
    var nome = req.body.nomeServer;
    var idUsuario = req.body.idUsuarioServer;

    // String(nome).trim() tira os espaços do começo e do fim.
    // Assim, um nome só com espaços ("   ") também conta como vazio.
    if (nome == undefined || String(nome).trim() == "") {
        return res.status(400).send("O nome do hábito está vazio!");
    }
    if (idUsuario == undefined) {
        return res.status(400).send("idUsuario está undefined!");
    }
    // Salva o hábito já sem os espaços sobrando
    responder(habitoModel.adicionarPorNome(String(nome).trim(), idUsuario), res, "criar hábito");
}

// Deixa todas as funções disponíveis para outros arquivos usarem
// (por exemplo, o arquivo de rotas chama cada uma delas).
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