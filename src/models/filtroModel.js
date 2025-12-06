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
    m.nome AS estatistica_macro,
    te.id AS idTipoEscola,
    uf.id AS idEstado,
    m.id AS idestatistica_macro
    FROM filtro f
    JOIN usuario u ON f.usuario_id = u.id
    JOIN tipoEscola te ON f.tipoEscola_id = te.id
    JOIN UF uf ON f.UF_id = uf.id
    LEFT JOIN estatistica_macro m ON f.estatistica_macro_id = m.id
    WHERE f.usuario_id = ${idUsuario};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



function inserir(nomeFiltro, estatistica_macro_id, tipoEscola_id, UF_id, usuario_id, emUso) {
    console.log("Dentro do Model de filtros na função inserir() passando os seguintes dados para o banco:",
        nomeFiltro, estatistica_macro_id, tipoEscola_id, UF_id, usuario_id, emUso);

    var instrucaoSql = `
        INSERT INTO filtro (nome, estatistica_macro_id, tipoEscola_id, UF_id, usuario_id, emUso)
        VALUES ('${nomeFiltro}', '${estatistica_macro_id}', '${tipoEscola_id}', '${UF_id}', '${usuario_id}', '${emUso}');
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletarFiltro(id,idUsuario) {
    console.log("Dentro do Model de FILTRO na função  deletarFiltro() passando os seguintes dados para o banco",id,idUsuario);

    var instrucaoSql = `
        DELETE FROM filtro
        WHERE id = ${id} AND usuario_id = ${idUsuario};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizar(nomeFiltro, estatistica_macro_id, tipoEscola_id, UF_id, idUsuario, id) {
    console.log("Model atualizar filtro recebendo:", nomeFiltro, estatistica_macro_id, tipoEscola_id, UF_id, idUsuario, id);

    const instrucaoSql = `
        UPDATE filtro
        SET nome = '${nomeFiltro}',
            estatistica_macro_id = ${estatistica_macro_id},
            tipoEscola_id = ${tipoEscola_id},
            UF_id = ${UF_id}
        WHERE usuario_id = ${idUsuario} AND id = ${id};
    `;

    console.log("Executando SQL:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
async function atualizarStatus(id,idUsuario) {
    console.log("Dentro do Model de Filtros na função  atualizarStatus() passando os seguintes dados para o banco",id,idUsuario);

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
        WHERE usuario_id = ${idUsuario} AND id = ${id};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql2);
    return await database.executar(instrucaoSql2);
}

async function listarestatistica_macros() {
    console.log("Dentro do Model na função listarestatistica_macros()");
    const instrucaoSql = `
        SELECT * FROM estatistica_macro;
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
    listarestatistica_macros,
    listarEstados,
    listarTiposEscola
};