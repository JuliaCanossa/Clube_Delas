function regras() {
    div_exibir.innerHTML = `
        <div class="regras">
            <p>Nome</p>
            <ul>
                <li>Mínimo de 3 caracteres</li>
            </ul>

            <p>E-mail</p>
            <ul>
                <li>Precisa ter @ e ponto (exemplo: nome@email.com)</li>
            </ul>

            <p>Senha</p>
            <ul>
                <li>Mínimo de 8 caracteres</li>
                <li>Uma letra maiúscula</li>
                <li>Um número</li>
            </ul>

            <p>Confirmar senha</p>
            <ul>
                <li>Igual à senha digitada</li>
            </ul>
        </div>`;
}


// Confere as regras, uma de cada vez.
// Se alguma estiver errada, devolve o texto do erro e para.
// Se estiver tudo certo, devolve "" (vazio).
function validar(nome, email, senha, confirmar) {
    // nenhum campo pode ficar vazio
    if (nome == "" || email == "" || senha == "" || confirmar == "") {
        return "Preencha todos os campos!";
    }

    // nome
    if (nome.length < 3) {
        return "O nome deve ter no mínimo 3 caracteres!";
    }

    // e-mail
    if (!email.includes("@") || !email.includes(".")) {
        return "O e-mail precisa ter @ e ponto (exemplo: nome@email.com)!";
    }

    // senha: tamanho
    if (senha.length < 8) {
        return "A senha deve ter no mínimo 8 caracteres!";
    }

    // senha: procura uma letra maiúscula e um número, letra por letra
    let temMaiuscula = false;
    let temNumero = false;

    for (let i = 0; i < senha.length; i++) {
        let letra = senha[i];

        if (letra >= "A" && letra <= "Z") {
            temMaiuscula = true;
        }
        if (letra >= "0" && letra <= "9") {
            temNumero = true;
        }
    }

    if (!temMaiuscula) {
        return "A senha deve ter uma letra maiúscula!";
    }
    if (!temNumero) {
        return "A senha deve ter pelo menos um número!";
    }

    if (senha != confirmar) {
        return "As senhas não são iguais!";
    }

    return "";
}


function mostrarErro(texto) {
    alert(texto);
    div_exibir.innerHTML = texto;
}


function cadastrar() {
    let nomeVar = ipt_cad_nome.value.trim();
    let emailVar = ipt_cad_email.value.trim();
    let senhaVar = ipt_cad_senha.value;
    let confirmarVar = ipt_cad_confirmar.value;

    let erro = validar(nomeVar, emailVar, senhaVar, confirmarVar);

    if (erro != "") {
        mostrarErro(erro);
        return;
    }

    div_exibir.innerHTML = "Criando sua conta...";

    // envia para o servidor
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
            alert("Conta criada com sucesso! Você será redirecionada para o login.");
            div_exibir.innerHTML = "Conta criada! Redirecionando para o login...";

            setTimeout(function () {
                window.location = "login.html";
            }, 2000);

        } else {
            mostrarErro("Não foi possível criar a conta. Verifique se o e-mail já está cadastrado.");
        }

    }).catch(function (erro) {
        console.log("#ERRO: ", erro);
        mostrarErro("Erro de conexão com o servidor.");
    });
}