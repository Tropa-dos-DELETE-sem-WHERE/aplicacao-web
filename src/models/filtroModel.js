// 

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
    m.nome AS materia,
    te.id AS idTipoEscola,
    uf.id AS idEstado,
    m.id AS idMateria
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

function inserir(nomeFiltro, materia_id, tipoEscola_id, UF_id, usuario_id, emUso) {
    console.log("Dentro do Model de filtros na função inserir() passando os seguintes dados para o banco:",
        nomeFiltro, materia_id, tipoEscola_id, UF_id, usuario_id, emUso);

    var instrucaoSql = `
        INSERT INTO filtro (nome, materia_id, tipoEscola_id, UF_id, usuario_id, emUso)
        VALUES ('${nomeFiltro}', '${materia_id}', '${tipoEscola_id}', '${UF_id}', '${usuario_id}', '${emUso}');
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletarFiltro(idFiltro, idUsuario) {
    console.log("Dentro do Model de FILTRO na função  deletarFiltro() passando os seguintes dados para o banco",idFiltro,idUsuario);

    var instrucaoSql = `
        DELETE FROM filtro
        WHERE id = ${idFiltro} AND usuario_id = ${idUsuario};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizar(nomeFiltro, materia_id, tipoEscola_id, UF_id, idUsuario, idFiltro) {
    console.log("Model atualizar filtro recebendo:", nomeFiltro, materia_id, tipoEscola_id, UF_id, idUsuario, idFiltro);

    const instrucaoSql = `
        UPDATE filtro
        SET nome = '${nomeFiltro}',
            materia_id = ${materia_id},
            tipoEscola_id = ${tipoEscola_id},
            UF_id = ${UF_id}
        WHERE usuario_id = ${idUsuario} AND id = ${idFiltro};
    `;

    console.log("Executando SQL:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
async function atualizarStatus(idFiltro ,idUsuario) {
    console.log("Dentro do Model de Filtros na função  atualizarStatus() passando os seguintes dados para o banco",idFiltro,idUsuario);

    const instrucaoSql = `
        UPDATE filtro
        SET emUso = 'nao'
        WHERE usuario_id = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    await database.executar(instrucaoSql);

     const instrucaoSql2 = `
        UPDATE filtro
        SET emUso = 'sim'
        WHERE usuario_id = ${idUsuario} AND id = ${idFiltro};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql2);
    return await database.executar(instrucaoSql2);
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
    deletarFiltro,
    atualizarStatus,
    listarMaterias,
    listarEstados,
    listarTiposEscola
};