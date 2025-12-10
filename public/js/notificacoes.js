window.onload = () => {
    listarCanal();
}
let canal  = null;
async function listarCanal()
{
    const idUsuario = sessionStorage.ID_USUARIO;

        await fetch(`/notificacao/listarSlack/${idUsuario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
        })
        .then(res => res.json())
        .then(canais => {
            canal = canais
            renderizarStatus(canal[0].solicitou);
        })
        .catch(err => {
            console.error("Erro ao buscar canais:", err);
        });

}

function renderizarStatus(status) {
    const main = document.getElementById("statusPedido");
    console.log(status)
    if (status === "nao") {
        main.innerHTML = `
            <h1 class="titulo">Notificações via Slack</h1>
            <p id="aviso">
                <span>AVISO:</span> Nosso sistema envia alertas automáticos para te manter informado sobre o desempenho e a atividade da sua escola!
            </p>
            <div class="container">
                <h2>Você receberá notificações se:</h2>
                <ol>
                    <li><span>-</span> As notas da sua escola ficarem abaixo da mediana nacional em alguma área de conhecimento.</li>
                    <li><span>-</span> Qualquer professor acessar a aplicação, você receberá uma informação do acesso para acompanhar quem entrou.</li>
                    <li><span>-</span> Houver acesso à sua conta vinculada à escola, garantindo maior controle e segurança.</li>
                </ol>
            </div>
            <div class="container">
                <h2>Benefícios</h2>
                <ol>
                    <li><span>1.</span> Ter acesso imediato a dados acadêmicos importantes, direto na ponta, sem burocracia.</li>
                    <li><span>2.</span> Receber logs detalhados de acesso, incluindo data/hora, tipo de usuário e nome de quem entrou na aplicação.</li>
                </ol>
            </div>
            <div class="container">
                <h2>Personalização</h2>
                <p>Você poderá configurar quais tipos de mensagens deseja receber, escolhendo apenas os alertas mais relevantes.</p>
            </div>
            <div class="container">
                <h2>Como começar</h2>
                <ol>
                    <li><span>Passo 1:</span> Clique em Solicitar Canal.</li>
                    <li><span>Passo 2:</span> Sua solicitação será enviada ao administrador.</li>
                    <li><span>Passo 3:</span> O administrador criará um canal exclusivo no Slack para sua escola.</li>
                    <li><span>Passo 4:</span> Assim que o canal estiver pronto, você passará a receber os alertas automaticamente.</li>
                </ol>
            </div>
            <div class="button">
                <button onclick="solicitar()">Solicitar canal</button>
            </div>
        `;
    } else if (status === "pendente") {
        main.innerHTML = `
            <h2 class="titulo">Status:</h2>
            <div class="aviso azul">
                <h2 class="titulo"><img src="./assets/icons/ampulheta dark.svg" alt=""> Solicitação em andamento...</h2>
                <div>
                    <p>Você já pediu a criação de um canal Slack!</p>
                    <p>Um administrador irá configurar o canal.</p>
                    <p>Assim que estiver pronto, você começará a receber notificações de desempenho e acessos.</p>
                </div>
            </div>
        `;
    } else if (status === "criado") {
        main.innerHTML = `
            <div class="aviso verde">
                <h2 class="titulo"><img src="./assets/icons/check dark.svg" alt=""> Canal configurado</h2>
                <div>
                    <p>Seu canal Slack já está ativo!</p>
                    <p>A partir de agora, você receberá notificações sobre as notas e os acessos da sua escola, diretamente no Slack.</p>
                </div>
            </div>
            <div class="container-cofiguracao">
                <h2 class="titulo">Receber notificações</h2>
                <label class="toggle">
                    <input type="checkbox">
                    <span class="slider"></span>
                </label>
            </div>
        `;
    }
}

function solicitar()
{
    fetch(`/notificacao/alterarStatusCanal`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
      body: JSON.stringify({canal}),
    })
      .then(function (resposta) {
        if (resposta.status === 200) {
          console.log(resposta);
          location.reload();

        }
      })
      .catch(function (erro) {
        console.error(`#ERRO: ${erro}`);
      });
}

