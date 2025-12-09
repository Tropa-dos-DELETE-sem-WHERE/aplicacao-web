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
            console.log(canais);
            canal = canais;
        })
        .catch(err => {
            console.error("Erro ao buscar canais:", err);
        });

}



function solicitar()
{
    const idUsuario = sessionStorage.ID_USUARIO;
    fetch(`/notificacao/solicitarCanal/${idUsuario}`, {
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


// <h1 class="titulo">Notificações via Slack</h1>
//     <p class="aviso" id="aviso-azul">
//         <span>AVISO:</span> Nosso sistema envia alertas automáticos para te manter informado sobre o desempenho e a atividade da sua escola!
//     </p>

//     <div class="container">
//         <h2>Você receberá notificações se:</h2>
//         <ol>
//             <li><span>-</span> As notas da sua escola ficarem abaixo da mediana nacional em alguma área de conhecimento.</li>
//             <li><span>-</span> Qualquer professor acessar a aplicação, você receberá uma informação do acesso para acompanhar quem entrou.</li>
//             <li><span>-</span> Houver acesso à sua conta vinculada à escola, garantindo maior controle e segurança.</li>
//         </ol>
//     </div>

//     <div  class="container">
//         <h2>Benefícios</h2>
//         <ol>
//             <li><span>1.</span> Ter acesso imediato a dados acadêmicos importantes, direto na ponta, sem burocracia.</li>
//             <li><span>2.</span> Receber logs detalhados de acesso, incluindo data/hora, tipo de usuário (gestor ou professor) e nome de quem entrou na aplicação.</li>
//         </ol>
//     </div>

//     <div class="container">
//         <h2>Personalização</h2>
//         <p>
//             Você poderá configurar quais tipos de mensagens deseja receber, escolhendo apenas os alertas mais relevantes.
//         </p>
//     </div>

//     <div class="container">
//         <h2>Como começar</h2>
//         <ol>
//             <li><span>Passo 1:</span> Clique em Solicitar Canal.</li>
//             <li><span>Passo 2:</span> Sua solicitação será enviada ao administrador</li>
//             <li><span>Passo 3:</span> O administrador criará um canal exclusivo no Slack para sua escola e configurará o webhook</li>
//             <li><span>Passo 4:</span> Assim que o canal estiver pronto, você passará a receber os alertas automaticamente, do jeito que preferir</li>
//         </ol>
//     </div>

// <div class="button">
//     <button onclick="solicitar()">Solicitar canal</button>
// </div>