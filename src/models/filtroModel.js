var database = require("../database/config")

function listarFiltrosByUsuario(idUsuario) {
    console.log("Dentro do Model de filtros na função listarFiltrosByUsuario()");
    
    var instrucaoSql = `
        SELECT 
            f.nome as nome,
            f.estatistica_macro as materia,
            f.id AS idFiltro,
            f.usuario_id,
            f.emUso as emUso,
            te.tipo AS tipoEscola,
            uf.uf AS UF
        FROM filtro f
        JOIN tipoEscola te ON f.tipoEscola_id = te.id
        JOIN UF uf ON f.UF_id = uf.id
        WHERE f.usuario_id = ${idUsuario};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function inserir(nomeFiltro, estatistica_macro_id, tipoEscola_id, UF_id, usuario_id, emUso) {
    console.log("Dentro do Model de filtros na função inserir() passando os seguintes dados para o banco:",
        nomeFiltro, estatistica_macro_id, tipoEscola_id, UF_id, usuario_id, emUso);

    var instrucaoSql = `
        INSERT INTO filtro (nome, estatistica_macro, tipoEscola_id, UF_id, usuario_id, emUso)
        VALUES ('${nomeFiltro}', '${estatistica_macro_id}', '${tipoEscola_id}', '${UF_id}', '${usuario_id}', 0);
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletarFiltro(id) {
    console.log("Dentro do Model de FILTRO na função  deletarFiltro() passando os seguintes dados para o banco",id);

    var instrucaoSql = `
        DELETE FROM filtro
        WHERE id = ${id};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizar(nomeFiltro, estatistica_macro_id, tipoEscola_id, UF_id, idUsuario) {
    console.log("Model atualizar filtro recebendo:", nomeFiltro, estatistica_macro_id, tipoEscola_id, UF_id, idUsuario);

    const instrucaoSql = `
        UPDATE filtro
        SET nome = '${nomeFiltro}',
            estatistica_macro = '${estatistica_macro_id}',
            tipoEscola_id = ${tipoEscola_id},
            UF_id = ${UF_id}
        WHERE id = ${idUsuario};
    `;

    console.log("Executando SQL:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

async function atualizarStatus(id) {
    console.log("Dentro do Model de Filtros na função  atualizarStatus() passando os seguintes dados para o banco",id);

    const instrucaoSql = `
        UPDATE filtro
        SET emUso = 0
        WHERE usuario_id = ${id};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    await database.executar(instrucaoSql);

     const instrucaoSql2 = `
        UPDATE filtro
        SET emUso = 1
        WHERE id = ${id};
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
        SELECT * FROM tipoEscola LIMIT 4;
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