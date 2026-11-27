
// var ambiente_processo = 'producao';
// qual ambiente a aplicação esta rodando
var ambiente_processo = 'desenvolvimento';

// Escolhe qual arquivo de variáveis de ambiente será lido.
var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';

// Carrega as variáveis do arquivo escolhido para dentro de process.env.
require("dotenv").config({ path: caminho_env });

// os servidores com as requisisções que vão ser utilizadas

// Express: framework(, o framework é o Express. Sem ele, você teria 
// que escrever manualmente todo o código para receber requisições HTTP, 
// separar rotas, ler JSON etc) que cria o servidor(onde vai ser exibdio as requisições através do https) web e 
// gerencia as rotas
var express = require("express");

// CORS:cors(Compartilhamento de Recursos entre Origens Diferentes)
//  permite que outros endereços (ex: um front-end em outra porta
// ou domínio) façam requisições para este servidor.
// Sem ele, o navegador bloqueia essas requisições.
var cors = require("cors");

// Path: módulo nativo do Node para montar caminhos de pastas/arquivos
// de forma segura, funcionando em Windows, Linux e Mac
var path = require("path");

// Porta e host do servidor, vindos do arquivo .env
// Exemplo: APP_PORT=3333 e APP_HOST=localhost
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

// CRIAÇÃO DA APLICAÇÃO

// Cria a aplicação Express. É o "servidor" em si,
// onde vamos configurar () e rotas.

// middlewares:Middleware é uma função que fica no meio do
// caminho entre a requisição chegar no servidor e a resposta ser enviada ao cliente.
// Pense em um prédio com portaria: antes de chegar ao apartamento (a rota), 
// a pessoa passa pelo porteiro, que confere documento, anota o nome e libera ou barra a
// entrada. Cada etapa dessas é um middleware.
var app = express(); // servidor que as rotas vão ser configuradas

// Arquivo que define as rotas da raiz do site ("/")
var indexRouter = require("./src/routes/index");

// Arquivo que define as rotas relacionadas a usuários
// (ex: cadastro, login, listagem)
var usuarioRouter = require("./src/routes/usuarios");

// MIDDLEWARES (funções que rodam em toda requisição, antes das rotas)

// Permite que o servidor entenda requisições com corpo em JSON.
// O conteúdo fica disponível em req.body.
app.use(express.json());

// Permite entender dados enviados por formulários HTML
// (formato "application/x-www-form-urlencoded").
// extended: false usa a biblioteca padrão (querystring) para interpretar,
// aceitando apenas valores simples (texto e listas).
app.use(express.urlencoded({ extended: false }));

// Serve arquivos estáticos (HTML, CSS, JS, imagens) da pasta "public".
// __dirname é a pasta onde este arquivo está.
// Assim, public/index.html fica acessível direto pelo navegador.
app.use(express.static(path.join(__dirname, "public")));

// Ativa o CORS para todas as origens
app.use(cors());

// ROTAS

// Requisições para "/" são tratadas pelo indexRouter
app.use("/", indexRouter);

// Requisições que começam com "/usuarios" são tratadas pelo usuarioRouter
// Exemplo: /usuarios/cadastrar, /usuarios/autenticar
app.use("/usuarios", usuarioRouter);

// INICIA O SERVIDOR

// Faz o servidor "escutar" na porta definida e, quando estiver pronto,
// executa a função de callback, que mostra uma mensagem no terminal.
app.listen(PORTA_APP, function () {
     // Template string (crase): permite texto em várias linhas
    // e inserir variáveis com ${...}
    console.log(`
    ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######
    ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##
    ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##
    ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##
    #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##
    ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##
    ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######

    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :.

    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:.
    \n
    Se desenvolvimento, você está se conectando ao banco local.
    Se produção, você está se conectando ao banco remoto.
    \n
    Para alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'
    `);
});
