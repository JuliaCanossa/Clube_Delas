// importa a conexão com o banco
var database = require("../database/config");



// listar: hábitos da usuária e se cada um foi feito hoje
// colunas devolvidas: id_usuario_habito, nome, feitoHoje
function listar(idUsuario) {
    var instrucao = `
        SELECT 
        usuario_habito.id_usuario_habito,
        habito.nome,
               (SELECT COUNT(*)
                  FROM registro_habito
                 WHERE registro_habito.fk_usuario_habito = usuario_habito.id_usuario_habito
                   AND registro_habito.data_registro = CURDATE()) AS feitoHoje
        FROM usuario_habito
        JOIN habito ON habito.id_habito = usuario_habito.fk_habito
        WHERE usuario_habito.fk_usuario = ${Number(idUsuario)}
        ORDER BY usuario_habito.id_usuario_habito;
    `;
    return database.executar(instrucao);
}

// adicionarPorNome: sem alteração

async function adicionarPorNome(nome, idUsuario) {
    var nomeSeguro = String(nome).replace(/'/g, "''");
    var id = Number(idUsuario);

    var achado = await database.executar(
        `SELECT id_habito FROM habito WHERE nome = '${nomeSeguro}' LIMIT 1;`
    );

    var idHabito;
    if (achado.length > 0) {
        idHabito = achado[0].id_habito;
    } else {
        var novo = await database.executar(
            `INSERT INTO habito (nome) VALUES ('${nomeSeguro}');`
        );
        idHabito = novo.insertId;
    }

    return database.executar(
        `INSERT INTO usuario_habito (fk_usuario, fk_habito) VALUES (${id}, ${idHabito});`
    );
}

// marcar e desmarcar: sem alteração

function marcar(id) {
    return database.executar(`
        INSERT IGNORE INTO registro_habito (fk_usuario_habito, data_registro)
        VALUES (${Number(id)}, CURDATE());
    `);
}

function desmarcar(id) {
    return database.executar(`
        DELETE FROM registro_habito
        WHERE fk_usuario_habito = ${Number(id)} AND data_registro = CURDATE();
    `);
}

// dashboardHabitos: checks de cada hábito na semana atual
// colunas devolvidas: nome, checks

function dashboardHabitos(idUsuario) {
    return database.executar(`
        SELECT habito.nome,
               (SELECT COUNT(*)
                  FROM registro_habito
                 WHERE registro_habito.fk_usuario_habito = usuario_habito.id_usuario_habito
                   AND YEARWEEK(registro_habito.data_registro, 1) = YEARWEEK(CURDATE(), 1)) AS checks
        FROM usuario_habito
        JOIN habito ON habito.id_habito = usuario_habito.fk_habito
        WHERE usuario_habito.fk_usuario = ${Number(idUsuario)}
        ORDER BY checks DESC;
    `);
}

// dashboardDias: total de checks por dia da semana (0 = segunda ... 6 = domingo)
// colunas devolvidas: dia, total

function dashboardDias(idUsuario) {
    return database.executar(`
        SELECT WEEKDAY(data_registro) AS dia, COUNT(*) AS total
        FROM registro_habito
        WHERE fk_usuario_habito IN (SELECT id_usuario_habito
                                      FROM usuario_habito
                                     WHERE fk_usuario = ${Number(idUsuario)})
          AND YEARWEEK(data_registro, 1) = YEARWEEK(CURDATE(), 1)
        GROUP BY WEEKDAY(data_registro)
        ORDER BY dia;
    `);
}

module.exports = {
    listar,
    adicionarPorNome,
    marcar,
    desmarcar,
    dashboardHabitos,
    dashboardDias
};