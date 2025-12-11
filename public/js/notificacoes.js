window.onload = () => {
    listarCanal();
}
let canal  = null;
async function listarCanal()
{
    console.log("listou")
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
            renderizarStatus(canal);
        })
        .catch(err => {
            console.error("Erro ao buscar canais:", err);
        });

}

function renderizarStatus(canal) {
    const main = document.getElementById("statusPedido");
    console.log(canal[0].solicitou)
    const solicitou = canal[0].solicitou
    if (solicitou === "nao") {
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
    } else if (solicitou === "pendente") {
        main.innerHTML = `
            <h2 class="titulo">Status:</h2>
            <div class="aviso azul" title="
                Você já pediu a criação de um canal Slack!
                Um administrador irá configurar o canal.
                Assim que estiver pronto, você começará a receber notificações de desempenho e acessos.
            ">
                <h2 class="titulo"><img src="./assets/icons/ampulheta dark.svg" alt=""> Solicitação em andamento...</h2>
            </div>
        `;
    } else if (solicitou === "criado") {
        main.innerHTML = `
            <div class="aviso verde" title="
                Seu canal Slack já está ativo!
                A partir de agora, você receberá notificações sobre as notas e os acessos da sua escola, diretamente no Slack.
            ">
                <h2 class="titulo"><img src="./assets/icons/check dark.svg" alt=""> Canal configurado</h2>
            </div>
            <div class="container configuracoes">
                <h2 class="titulo"><img src="./assets/icons/config light.svg" alt=""> Configurações</h2>
                <table class="tabela-config">
                    <tr>
                        <td class="col-esquerda">Receber notificações</td>
                        <td class="col-direita">
                            <label class="toggle" for="receberNotificacoes" id="botao1" title="${canal[0].ligar_desligar === "ligar" ? "Ligado" : "Desligado"}">
                                <input type="checkbox" id="receberNotificacoes" onchange="ligarDelisgar()" ${canal[0].ligar_desligar === "ligar" ? "checked" : ""}>
                                <span class="slider"></span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td class="col-esquerda">Receber logs de acesso</td>
                        <td class="col-direita">
                            <label class="toggle" for="receberLogs" id="botao2" title="${canal[0].quer_logs ? "Ligado" : "Desligado"}">
                                <input type="checkbox" id="receberLogs" onchange="alterarLogs()" ${canal[0].quer_logs ? "checked" : ""}>
                                <span class="slider"></span>
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td class="col-esquerda">Receber notificações sobre a mediana</td>
                        <td class="col-direita">
                            <label class="toggle" for="receberMediana" id="botao3" title="${canal[0].quer_mediana ? "Ligado" : "Desligado"}">
                                <input type="checkbox" id="receberMediana" onchange="alterarMediana()" ${canal[0].quer_mediana ? "checked" : ""}>
                                <span class="slider"></span>
                            </label>
                        </td>
                    </tr>
                     <tr>
                        <td class="col-esquerda">Intervalo de notificações</td>
                        <td class="col-direita">
                            <select id="intervaloNotificacao" onchange="alterarIntervalo()">
                                <option value="sempre" ${canal[0].intervalo_notificacao === "sempre" ? "selected" : ""}>Sempre</option>
                                <option value="1dia" ${canal[0].intervalo_notificacao === "1dia" ? "selected" : ""}>A cada 1 dia</option>
                                <option value="7dias" ${canal[0].intervalo_notificacao === "7dias" ? "selected" : ""}>A cada 7 dias</option>
                                <option value="31dias" ${canal[0].intervalo_notificacao === "31dias" ? "selected" : ""}>A cada 31 dias</option>
                                <option value="365dias" ${canal[0].intervalo_notificacao === "365dias" ? "selected" : ""}>A cada 365 dias</option>
                            </select>
                        </td>
                    </tr>
                </table>
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

// função para mudar o título dos toggles das configurações
function mudarTitle() {
    const input1 = document.getElementById("receberNotificacoes");
    const input2 = document.getElementById("receberLogs");
    const input3 = document.getElementById("receberMediana");

    // se o botão estiver "checked" então o título será Ligado, se não, será Desligado
    document.getElementById("botao1").title = input1.checked ? "Ligado" : "Desligado";
    document.getElementById("botao2").title = input2.checked ? "Ligado" : "Desligado";
    document.getElementById("botao3").title = input3.checked ? "Ligado" : "Desligado";
}

function ligarDelisgar() {
    const idSlack = canal[0].idslack;
    console.log(canal[0].idslack);
    const checkbox = document.getElementById("receberNotificacoes");
    const novoStatus = checkbox.checked ? "ligar" : "desligar";

    fetch(`/notificacao/ligarDelisgar/${idSlack}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ligar_desligar: novoStatus })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Webhook atualizado:", data);
        document.getElementById("botao1").title = novoStatus === "ligar" ? "Ligado" : "Desligado";
    })
    .catch(err => console.error("Erro ao atualizar webhook:", err));
}

function alterarLogs() {
     const idSlack = canal[0].idslack;
    const checkbox = document.getElementById("receberLogs");
    const novoStatus = checkbox.checked ? 1 : 0;

    fetch(`/notificacao/alterarLogs/${idSlack}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quer_logs: novoStatus })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Logs atualizados:", data);
        document.getElementById("botao2").title = novoStatus ? "Ligado" : "Desligado";
    })
    .catch(err => console.error("Erro ao atualizar logs:", err));
}

function alterarMediana() {
     const idSlack = canal[0].idslack;
    const checkbox = document.getElementById("receberMediana");
    const novoStatus = checkbox.checked ? 1 : 0;

    fetch(`/notificacao/alterarMediana/${idSlack}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quer_mediana: novoStatus })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Mediana atualizada:", data);
        document.getElementById("botao3").title = novoStatus ? "Ligado" : "Desligado";
    })
    .catch(err => console.error("Erro ao atualizar mediana:", err));
}

function alterarIntervalo() {
    const idSlack = canal[0].idslack;
    const novoIntervalo = document.getElementById("intervaloNotificacao").value;

    fetch(`/notificacao/alterarIntervalo/${idSlack}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intervalo_notificacao: novoIntervalo })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Intervalo atualizado:", data);
    })
    .catch(err => console.error("Erro ao atualizar intervalo:", err));
}


