 function entrar() {
    let emailVar = (ipt_login_email.value);
    let senhaVar = (ipt_login_senha.value);

    if (emailVar == "" || senhaVar == "") {
        div_exibir_login.innerHTML = "Preencha e-mail e senha";

    } else {

        fetch("/usuarios/autenticar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                emailServer: emailVar,
                senhaServer: senhaVar
            })
        }).then(function (resposta) {

            if (resposta.ok) {
                resposta.json().then(function (json) {
                    sessionStorage.EMAIL_USUARIO = json.email;
                    sessionStorage.NOME_USUARIO = json.nome;
                    sessionStorage.ID_USUARIO = json.id;

                    div_exibir_login.innerHTML = "Bem-vinda, " + json.nome + "!";

                    setTimeout(function () {
                        window.location = "dashboard.html";
                    }, 1000);
                });
                      } else {
                resposta.text().then(function (texto) {
                    div_exibir_login.innerHTML = texto;
                });
            }

        }).catch(function (erro) {
            console.log("#ERRO: ", erro);
            div_exibir_login.innerHTML = "Erro de conexão com o servidor.";
        });
    }
}