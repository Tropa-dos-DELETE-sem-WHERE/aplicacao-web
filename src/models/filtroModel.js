var database = require("../database/config")

async function listarFiltrosByUsuario(idUsuario) {
    console.log("Dentro do Model de filtros na função listarFiltrosByUsuario()");
    
    var instrucaoSql = `
        SELECT 
    f.id,
    f.nome,
    f.emUso,
    u.nome AS usuario,
    te.tipo AS tipoEscola,
    uf.uf AS estado,
    m.nome AS materia
    FROM filtro f
    JOIN usuario u ON f.usuario_id = u.id
    JOIN tipoEscola te ON f.tipoEscola_id = te.id
    JOIN UF uf ON f.UF_id = uf.id
    LEFT JOIN materia m ON f.materia_id = m.id
    WHERE f.usuario_id = ${idUsuario};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



function inserir(titulo, dataLimite, anotacao, idUsuario, status) {
    console.log("Dentro do Model de s na função  inserir() passando os seguintes dados para o banco",titulo, dataLimite, anotacao, idUsuario, status);

    var instrucaoSql = `
        INSERT INTO  (titulo, desc, dataExpiracao, usuario_id, status)
        VALUES ('${titulo}', '${anotacao}', '${dataLimite}', '${idUsuario}','${status}');
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletar(id,idUsuario) {
    console.log("Dentro do Model de s na função  deletar() passando os seguintes dados para o banco",id,idUsuario);

    var instrucaoSql = `
        DELETE FROM 
        WHERE id = ${id} AND usuario_id = ${idUsuario};
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
function atualizar(titulo, dataLimite, anotacao, idUsuario, status,id) {
    console.log("Dentro do Model de s na função  atualizar() passando os seguintes dados para o banco",titulo, dataLimite, anotacao, idUsuario, status,id);

    const instrucaoSql = `
        UPDATE 
        SET titulo = '${titulo}',
            desc = '${anotacao}',
            dataExpiracao = '${dataLimite}',
            status = '${status}'
        WHERE usuario_id = ${idUsuario} AND id = ${id};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
function atualizarStatus(status,id,idUsuario) {
    console.log("Dentro do Model de s na função  atualizarStatus() passando os seguintes dados para o banco",status,id,idUsuario);

    const instrucaoSql = `
        UPDATE 
        SET status = '${status}'
        WHERE usuario_id = ${idUsuario} AND id = ${id};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

async function listarMaterias() {
    console.log("Dentro do Model na função listarMaterias()");
    const instrucaoSql = `
        SELECT * FROM materia;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

async function listarEstados() {
    console.log("Dentro do Model na função listarEstados()");
    const instrucaoSql = `
        SELECT * FROM UF;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

async function listarTiposEscola() {
    console.log("Dentro do Model na função listarTiposEscola()");
    const instrucaoSql = `
        SELECT * FROM tipoEscola;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    atualizar,
    listarFiltrosByUsuario,
    inserir,
    deletar,
    atualizarStatus,
    listarMaterias,
    listarEstados,
    listarTiposEscola
};