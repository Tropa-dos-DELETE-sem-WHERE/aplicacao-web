const notificacaoModel = require("../models/notificacaoModel");

function listarSlack(req, res){
const idUsuario = req.params.idUsuario;
    if (idUsuario == undefined) {
        res.status(400).send("O idUsuario da meta está undefined!");
    }else {
            console.log("Estou no controller passando os seguintes dados");
            console.log(idUsuario);
            notificacaoModel.listarSlack(idUsuario).then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);
                    res.json(resultadoAutenticar)
                }).catch(
                            function (erro) {
                                console.log(erro);
                                console.log("\nHouve um erro Listar os ! Erro: ", erro.sqlMessage);
                                res.status(500).json(erro.sqlMessage);
                            }
                        );
            }
}
function listarTodosSlack(req, res){

            console.log("Estou no controller passando os seguintes dados");
            notificacaoModel.listarTodosSlack().then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);
                    res.json(resultadoAutenticar)
                }).catch(
                            function (erro) {
                                console.log(erro);
                                console.log("\nHouve um erro Listar os ! Erro: ", erro.sqlMessage);
                                res.status(500).json(erro.sqlMessage);
                            }
                        );
}

function alterarStatusCanal(req, res) {
console.log("Estou no controller passando os seguintes dados");
    const canal = req.body.canal[0];
    const idslack = canal.idslack;
    const solicitou = "pendente";

    notificacaoModel.alterarStatusCanal(idslack, solicitou)
    .then(function (resultado) {
        res.json(resultado);
    })
    .catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    });
}
async function alterarWebhookCanal(req, res) {
    const idslack = req.params.idSlack;
    const webhook = req.body.webhook;
    const solicitou =  "criado";
    console.log("Estou no controller passando os seguintes dados");
            console.log(idslack);
            console.log(webhook);
            console.log(solicitou);
  
    await notificacaoModel.alterarStatusCanal(idslack, solicitou);
    const resultado = await notificacaoModel.alterarWebhookCanal(idslack, webhook);
    return res.json(resultado);
    
}

function ligarDelisgar(req, res) {
    const idSlack = req.params.idSlack;
    const ligar_desligar= req.body.ligar_desligar;
    console.log("Estou no controller passando os seguintes dados");
            console.log(idSlack);
            console.log(ligar_desligar);
    notificacaoModel.ligarDelisgar(idSlack, ligar_desligar)
        .then(resultado => res.json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function alterarLogsCanal(req, res) {
    const idSlack = req.params.idSlack;
    const quer_logs = req.body.quer_logs;
    notificacaoModel.alterarLogsCanal(idSlack, quer_logs)
        .then(resultado => res.json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function alterarMedianaCanal(req, res) {
    const idSlack = req.params.idSlack;
    const quer_mediana  = req.body.quer_mediana;

    notificacaoModel.alterarMedianaCanal(idSlack, quer_mediana)
        .then(resultado => res.json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}

function alterarIntervaloCanal(req, res) {
    const idSlack = req.params.idSlack;
    const intervalo_notificacao = req.body.intervalo_notificacao;

    notificacaoModel.alterarIntervaloCanal(idSlack, intervalo_notificacao)
        .then(resultado => res.json(resultado))
        .catch(erro => res.status(500).json(erro.sqlMessage));
}


module.exports = {
    listarSlack,
    alterarStatusCanal,
    listarTodosSlack,
    alterarWebhookCanal,
    ligarDelisgar,
    alterarLogsCanal,
    alterarMedianaCanal,
    alterarIntervaloCanal
}