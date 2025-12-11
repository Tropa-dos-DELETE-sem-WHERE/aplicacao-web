var database = require("../database/config")

async function listarSlack(idUsuario){
      console.log("Dentro do Model de Notificacao na função  listarSlack() passando os seguintes dados para o banco",idUsuario);
        var instrucaoSql = 
    `
       SELECT * FROM slack WHERE usuario_id = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarTodosSlack() {
    console.log("Model: listarTodosSlack");

    const instrucaoSql = `
        SELECT s.idslack,
               s.nomeCanal,
               s.escola_id,
               s.usuario_id,
               u.nome AS nomeUsuario,
               u.email AS emailUsuario,
               s.solicitou,
               s.intervalo_notificacao,
               s.ligar_desligar,
               s.ultima_notificacao
        FROM slack s
        JOIN usuario u ON s.usuario_id = u.id
        WHERE s.solicitou = 'pendente';
    `;

    console.log("Executando SQL:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function alterarStatusCanal(idslack, solicitou, usuario_id,idUsuarioLogado) {
      console.log("Dentro do Model de Notificacao na função  solicitarCanal() passando os seguintes dados para o banco",idslack, solicitou, usuario_id,idUsuarioLogado);

    const instrucaoSql = `
        UPDATE slack
        SET solicitou = '${solicitou}'
        WHERE idslack = ${idslack};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function alterarWebhookCanal(idslack, solicitou) {
      console.log("Dentro do Model de Notificacao na função  solicitarCanal() passando os seguintes dados para o banco",idslack, solicitou);

    const instrucaoSql = `
        UPDATE slack
        SET canal = '${solicitou}'
        WHERE idslack = ${idslack};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function ligarDelisgar(idSlack, ligar_desligar) {
        console.log("Dentro do Model de Notificacao na função  ligarDelisgar() passando os seguintes dados para o banco",idSlack, ligar_desligar);
    const sql = `
        UPDATE slack
        SET ligar_desligar = '${ligar_desligar}'
        WHERE idslack = ${idSlack};
    `;
    return database.executar(sql);
}

function alterarLogsCanal(idSlack, quer_logs) {
    const sql = `
        UPDATE slack
        SET quer_logs = ${quer_logs}
        WHERE idslack = ${idSlack};
    `;
    return database.executar(sql);
}

function alterarMedianaCanal(idSlack, quer_mediana) {
    const sql = `
        UPDATE slack
        SET quer_mediana = ${quer_mediana}
        WHERE idslack = ${idSlack};
    `;
    return database.executar(sql);
}

function alterarIntervaloCanal(idSlack, intervalo_notificacao) {
    const sql = `
        UPDATE slack
        SET intervalo_notificacao = '${intervalo_notificacao}'
        WHERE idslack = ${idSlack};
    `;
    return database.executar(sql);
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
};