var database = require("../database/config");

function adicionar(nome, idUsuario) {
    var instrucao = "INSERT INTO habitos (nome, fkUsuario) VALUES (?, ?);";
    return database.executar(instrucao, [nome, idUsuario]);
}

// cada hábito e se já foi marcado hoje
function listar(idUsuario) {
    var instrucao = `
        SELECT h.idHabito, h.nome,
               (SELECT COUNT(*) FROM checklist c
                WHERE c.fkHabito = h.idHabito AND c.dataCheck = CURDATE()) AS feitoHoje
        FROM habitos h
        WHERE h.fkUsuario = ?;
    `;
    return database.executar(instrucao, [idUsuario]);
}

function marcar(idHabito) {
    var instrucao = "INSERT INTO checklist (fkHabito, dataCheck) VALUES (?, CURDATE());";
    return database.executar(instrucao, [idHabito]);
}

function desmarcar(idHabito) {
    var instrucao = "DELETE FROM checklist WHERE fkHabito = ? AND dataCheck = CURDATE();";
    return database.executar(instrucao, [idHabito]);
}

// checks de cada hábito na semana atual (segunda a domingo)
function dashboardHabitos(idUsuario) {
    var instrucao = `
        SELECT h.nome, COUNT(c.idChecklist) AS checks
        FROM habitos h
        LEFT JOIN checklist c
               ON c.fkHabito = h.idHabito
              AND YEARWEEK(c.dataCheck, 1) = YEARWEEK(CURDATE(), 1)
        WHERE h.fkUsuario = ?
        GROUP BY h.idHabito, h.nome;
    `;
    return database.executar(instrucao, [idUsuario]);
}

// total de checks por dia da semana atual
function dashboardDias(idUsuario) {
    var instrucao = `
        SELECT DAYOFWEEK(c.dataCheck) AS dia, COUNT(*) AS total
        FROM checklist c
        JOIN habitos h ON h.idHabito = c.fkHabito
        WHERE h.fkUsuario = ?
          AND YEARWEEK(c.dataCheck, 1) = YEARWEEK(CURDATE(), 1)
        GROUP BY DAYOFWEEK(c.dataCheck);
    `;
    return database.executar(instrucao, [idUsuario]);
}
function marcar(idHabito) {
    var instrucao = "INSERT IGNORE INTO checklist (fkHabito, dataCheck) VALUES (?, CURDATE());";
    return database.executar(instrucao, [idHabito]);
}

module.exports = { adicionar, listar, marcar, desmarcar, dashboardHabitos, dashboardDias };