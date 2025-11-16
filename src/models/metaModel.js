var database = require("../database/config")

async function listarMetaByUsuario(idUsuario,status){
     console.log("Dentro do Model de metas na função  listarMeta() aqui vou apenas receber os dados de um usuario X");
     const atualizarExpiradas = `
    UPDATE meta
    SET statusMeta = 'expiradas'
    WHERE usuario_id = ${idUsuario}
      AND statusMeta = 'abertas'
      AND dataExpiracao < CURDATE();
  `;
    await database.executar(atualizarExpiradas);
    console.log("Executando a instrução SQL: \n" + atualizarExpiradas);
    if(status == 'todas')
    {
        var instrucaoSql = 
    `
       SELECT * FROM meta WHERE usuario_id = ${idUsuario};
    `;
    }else{
        var instrucaoSql = 
    `
       SELECT * FROM meta WHERE usuario_id = ${idUsuario} AND statusMeta = '${status}';
    `;
    }
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function inserirMeta(tituloMeta, dataLimite, anotacao, idUsuario, statusMeta) {
    console.log("Dentro do Model de metas na função  inserirMeta() passando os seguintes dados para o banco",tituloMeta, dataLimite, anotacao, idUsuario, statusMeta);

    var instrucaoSql = `
        INSERT INTO meta (tituloMeta, descMeta, dataExpiracao, usuario_id, statusMeta)
        VALUES ('${tituloMeta}', '${anotacao}', '${dataLimite}', '${idUsuario}','${statusMeta}');
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletarMeta(idMeta,idUsuario) {
    console.log("Dentro do Model de metas na função  deletarMeta() passando os seguintes dados para o banco",idMeta,idUsuario);

    var instrucaoSql = `
        DELETE FROM meta
        WHERE id = ${idMeta} AND usuario_id = ${idUsuario};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
function apagar(id) {
    console.log("ACESSEI O USUARIO MODEL \n\n function apagarUser(): ", id);

    var instrucaoSql = `
        apagar FROM usuario
        WHERE id = ${id};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
function atualizarMeta(tituloMeta, dataLimite, anotacao, idUsuario, statusMeta,idMeta) {
    console.log("Dentro do Model de metas na função  atualizarMeta() passando os seguintes dados para o banco",tituloMeta, dataLimite, anotacao, idUsuario, statusMeta,idMeta);

    const instrucaoSql = `
        UPDATE meta
        SET tituloMeta = '${tituloMeta}',
            descMeta = '${anotacao}',
            dataExpiracao = '${dataLimite}',
            statusMeta = '${statusMeta}'
        WHERE usuario_id = ${idUsuario} AND id = ${idMeta};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
function atualizarStatusMeta(statusMeta,idMeta,idUsuario) {
    console.log("Dentro do Model de metas na função  atualizarStatusMeta() passando os seguintes dados para o banco",statusMeta,idMeta,idUsuario);

    const instrucaoSql = `
        UPDATE meta
        SET statusMeta = '${statusMeta}'
        WHERE usuario_id = ${idUsuario} AND id = ${idMeta};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


module.exports = {
    atualizarMeta,
    listarMetaByUsuario,
    inserirMeta,
    deletarMeta,
    atualizarStatusMeta
};