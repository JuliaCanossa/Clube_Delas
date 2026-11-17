function cadastrar() {
    let nomeVar = ipt_cad_nome.value;
    let emailVar = ipt_cad_email.value;
    let senhaVar = ipt_cad_senha.value;
    let confirmarVar = ipt_cad_confirmar.value;

    if (nomeVar == "" || emailVar == "" || senhaVar == "" || confirmarVar == "") {
        div_exibir.innerHTML = "Preencha todos os campos";

    } else if (senhaVar != confirmarVar) {
        div_exibir.innerHTML = "As senhas não são iguais";

    } else {

        fetch("/usuarios/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nomeServer: nomeVar,
                emailServer: emailVar,
                senhaServer: senhaVar
            })
        }).then(function (resposta) {

            if (resposta.ok) {
                resposta.json().then(function (json) {
                    sessionStorage.ID_USUARIO = json.insertId;
                    sessionStorage.NOME_USUARIO = nomeVar;
                    sessionStorage.EMAIL_USUARIO = emailVar;

                    div_exibir.innerHTML = "Conta criada! Entrando...";

                    setTimeout(function () {
                        window.location = "dashboard.html";
                    }, 1500);
                });
            } else {
                div_exibir.innerHTML = "Não foi possível criar a conta. Tente novamente.";
            }

        }).catch(function (erro) {
            console.log("#ERRO: ", erro);
            div_exibir.innerHTML = "Erro de conexão com o servidor.";
        });
    }
}