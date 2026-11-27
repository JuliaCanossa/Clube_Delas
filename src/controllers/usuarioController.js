// Importa o arquivo usuarioModel, que é quem conversa com o banco de dados.
// O controller (este arquivo) recebe o pedido da tela, confere os dados
// e pede para o model buscar ou salvar no banco.
let usuarioModel = require("../models/usuarioModel");

// ---------- LOGIN ----------
// req = o pedido que chegou da tela (traz os dados digitados)
// res = a resposta que vamos devolver para a tela
function autenticar(req, res) {
    // Pega o email e a senha que a tela enviou dentro do "corpo" (body) do pedido
    let email = req.body.emailServer;
    let senha = req.body.senhaServer;

    // Confere se os dados chegaram. "undefined" significa que não veio nada.
    // Status 400 = "pedido errado" (faltou informação).
    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {
        // Se está tudo certo, pede para o model procurar esse email e senha no banco
        usuarioModel.autenticar(email, senha)
            // .then = "quando o banco responder, faça isto".
            // resultadoAutenticar é a lista de usuários encontrados.
            .then(function (resultadoAutenticar) {
                if (resultadoAutenticar.length == 1) {
                    // Achou exatamente 1 usuário: login correto.
                    // Devolve para a tela só id, email e nome (sem a senha).
                    res.json({
                        id: resultadoAutenticar[0].id,
                        email: resultadoAutenticar[0].email,
                        nome: resultadoAutenticar[0].nome
                    });
                } else if (resultadoAutenticar.length == 0) {
                    // Não achou ninguém: email ou senha errados.
                    // Status 403 = "acesso negado".
                    res.status(403).send("Email e/ou senha inválido(s)");
                } else {
                    // Achou mais de 1 usuário com o mesmo login (não deveria acontecer)
                    res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                }
            })
            // .catch = "se der erro no banco, faça isto"
            .catch(function (erro) {
                // Mostra o erro no terminal para ajudar a descobrir o problema
                console.log(erro);
                console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                // Status 500 = "erro no servidor"
                res.status(500).json(erro.sqlMessage);
            });
    }
}

// ---------- CADASTRO ----------
function cadastrar(req, res) {
    // Pega nome, email e senha que a tela enviou
    let nome = req.body.nomeServer;
    let email = req.body.emailServer;
    let senha = req.body.senhaServer;

    // Confere se os três chegaram. Se faltar algum, avisa qual foi (status 400).
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else {
        // Se está tudo certo, pede para o model salvar o novo usuário no banco
        usuarioModel.cadastrar(nome, email, senha)
            // Quando o banco terminar de salvar, devolve o resultado para a tela
            .then(function (resultado) {
                res.json(resultado);
            })
            // Se der erro ao salvar, mostra no terminal e avisa a tela (status 500)
            .catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao realizar o cadastro! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

// Deixa as duas funções disponíveis para outros arquivos usarem
// (por exemplo, o arquivo de rotas chama autenticar e cadastrar).
module.exports = {
    autenticar,
    cadastrar
};