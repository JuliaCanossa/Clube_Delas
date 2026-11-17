function dashboard(req, res) {
    var idUsuario = req.params.idUsuario;

    Promise.all([
        habitoModel.dashboardHabitos(idUsuario),
        habitoModel.dashboardDias(idUsuario)
    ]).then(function (resultados) {

        var habitos = resultados[0];   // [{ nome, checks }, ...]
        var dias = resultados[1];      // [{ dia, total }, ...]

        // monta o vetor de 7 posições: Seg, Ter, Qua, Qui, Sex, Sáb, Dom
        var checksPorDia = [0, 0, 0, 0, 0, 0, 0];

        for (var i = 0; i < dias.length; i++) {
            // DAYOFWEEK: 1 = domingo, 2 = segunda ... 7 = sábado
            // essa conta joga segunda na posição 0 e domingo na posição 6
            var posicao = (dias[i].dia + 5) % 7;
            checksPorDia[posicao] = dias[i].total;
        }

        res.json({ habitos: habitos, checksPorDia: checksPorDia });

    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = { adicionar, listar, marcar, desmarcar, dashboard };