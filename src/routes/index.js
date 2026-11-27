// src/routes/index.js

// O routes/index.js é o router da raiz do site.
// Mantive ele na estrutura padrão do Express, sem rotas próprias,
// porque as páginas são entregues pela pasta public e as rotas da 
// aplicação ficam todas em usuarios.js

var express = require("express");
var router = express.Router();

module.exports = router;