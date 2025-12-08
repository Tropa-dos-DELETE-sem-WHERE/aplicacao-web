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

function solicitarCanal(idslack, solicitou, usuario_id,idUsuarioLogado) {
      console.log("Dentro do Model de Notificacao na função  solicitarCanal() passando os seguintes dados para o banco",idslack, solicitou, usuario_id,idUsuarioLogado);

    const instrucaoSql = `
        UPDATE slack
        SET solicitou = '${solicitou}'
        WHERE idslack = ${idslack}
          AND usuario_id = ${usuario_id}
          AND usuario_id = ${idUsuarioLogado};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
module.exports = {
    listarSlack,
    solicitarCanal
};