router.get("/dashboard/:idUsuario", function (req, res) {
    habitoController.dashboard(req, res);
});