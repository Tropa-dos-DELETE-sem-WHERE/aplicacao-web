var database = require("../database/config")

function listar(){
    console.log("acessei o selctall")
    var instrucaoSql = 
    `
        SELECT * FROM usuario where tipoUsuario_id = 2;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function inserir(nome, email, senha, tipoUsuario, escola_id) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function inserirProfessor(): ", nome, email, senha, tipoUsuario, escola_id);

    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, escola_id, tipoUsuario_id)
        VALUES ('${nome}', '${email}', '${senha}', ${escola_id},${tipoUsuario});
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function apagar(idProfessor) {
    console.log("ACESSEI O USUARIO MODEL \n\n function apagarProfessor(): ", idProfessor);

    var instrucaoSql = `
        DELETE FROM usuario
        WHERE id = ${idProfessor};
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
function atualizar(id, nome, email, senha) {
    console.log("ACESSEI O USUARIO MODEL: atualizarProfessor()", id, nome, email, senha);

    const instrucaoSql = `
        UPDATE usuario
        SET nome = '${nome}',
            email = '${email}',
            senha = '${senha}'
        WHERE id = ${id};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    atualizar,
    listar,
    inserir,
    apagar
};