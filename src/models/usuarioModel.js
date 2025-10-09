const e = require("express");
var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT * FROM usuario WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

async function cadastrar(nomeInstituicao,nomeUsuario,email,senha,tipoUsuario) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nomeInstituicao, nomeUsuario, email,senha,tipoUsuario);
    const id_escola = `SELECT id FROM escola WHERE nomeEscola = '${nomeInstituicao}';`;
    const res = await database.executar(id_escola);
    console.log('id escola' + id_escola);
    console.log("res : "+res);
    if(res.length === 0)
    {
        const erro = new Error("Não existe essa escola");
        erro.tipo = "escola_nao_encontrada";
        throw erro;
    }
    var instrucaoSql = `
    INSERT INTO usuario (nome,email,senha,escola_id,tipoUsuario_id) VALUES ('${nomeUsuario}','${email}','${senha}',(SELECT id FROM escola WHERE nomeEscola = '${nomeInstituicao}'),'${tipoUsuario}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizarDadoByUser(idInstituicao,nomeUsuario,email,idUsuario) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function atualizarDadoByUser(): ",idInstituicao,nomeUsuario,email,idUsuario)
    var instrucaoSql = `
        UPDATE usuario
        SET nome = ${nomeUsuario}, email = ${email}, escola_id = ${idInstituicao}
        WHERE id = ${idUsuario}; 
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar,
    atualizarDadoByUser
};