var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT * FROM usuario WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

async function cadastrar(nomeInstituicao, nomeUsuario, email, senha, tipoUsuario) {
  console.log("ACESSEI O USUARIO MODEL");

  const sqlEscola = `SELECT codigoEscola, UF_id, tipoEscola_id FROM escola WHERE nomeEscola = '${nomeInstituicao}';`;
  const resEscola = await database.executar(sqlEscola);

  if (resEscola.length === 0) {
    const erro = new Error("Não existe essa escola");
    erro.tipo = "escola_nao_encontrada";
    throw erro;
  }

  const escola = resEscola[0];
  const escolaId = escola.codigoEscola;
  const ufId = escola.UF_id;
  const tipoEscolaId = escola.tipoEscola_id;

  const sqlUsuario = `
    INSERT INTO usuario (nome,email,senha,escola_id,tipoUsuario_id)
    VALUES ('${nomeUsuario}','${email}','${senha}',${escolaId},'${tipoUsuario}');
  `;
  console.log("Executando SQL usuário:\n" + sqlUsuario);
  await database.executar(sqlUsuario);

  const sqlUsuarioId = `SELECT id FROM usuario WHERE email = '${email}' AND escola_id = ${escolaId};`;
  const usuarioRes = await database.executar(sqlUsuarioId);
  const usuarioId = usuarioRes[0].id;

  const sqlFiltro = `
    INSERT INTO filtro (nome, materia_id, tipoEscola_id, UF_id, usuario_id, emUso)
    VALUES ('Filtro Padrão', ${1}, ${tipoEscolaId}, ${ufId}, ${usuarioId}, 'sim');
  `;
  console.log("Executando SQL filtro:\n" + sqlFiltro);
  await database.executar(sqlFiltro);
  
  const sqlSlack = `
  INSERT INTO slack (nomeCanal,ultima_notificacao,escola_id,usuario_id)VALUES ('canal-escola-${escolaId}',null,${escolaId},${usuarioId});
                `;
    console.log("Executando SQL filtro:\n" + sqlSlack);
   return await database.executar(sqlSlack);
}


function atualizarDadoByUser(idInstituicao,nomeUsuario,email,idUsuario) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function atualizarDadoByUser(): ",idInstituicao,nomeUsuario,email,idUsuario)
    var instrucaoSql = `
        UPDATE usuario
        SET nome = '${nomeUsuario}', email = '${email}', escola_id = ${idInstituicao}
        WHERE id = ${idUsuario}; 
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarProfessores(){
    console.log("acessei o selctall")
    var instrucaoSql = 
    `
        SELECT * FROM usuario where tipoUsuario_id = 2;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
function escolaUser(idUsuario){
    console.log("acessei o select escola do usuario com id :"+idUsuario);
    var instrucaoSql = 
    `
        SELECT e.* FROM usuario as u
        JOIN escola as e ON u.escola_id = e.codigoEscola
        where u.id = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function inserirProfessor(nome, email, senha, tipoUsuario, escola_id) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function inserirProfessor(): ", nome, email, senha, tipoUsuario, escola_id);

    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, escola_id, tipoUsuario_id)
        VALUES ('${nome}', '${email}', '${senha}', ${escola_id},${tipoUsuario});
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deleteProfessor(idProfessor) {
    console.log("ACESSEI O USUARIO MODEL \n\n function deleteProfessor(): ", idProfessor);

    var instrucaoSql = `
        DELETE FROM usuario
        WHERE id = ${idProfessor};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
function deleteUser(id) {
    console.log("ACESSEI O USUARIO MODEL \n\n function deleteUser(): ", id);

    var instrucaoSql = `
        DELETE FROM usuario
        WHERE id = ${id};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
function atualizarProfessor(id, nome, email, senha) {
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
    autenticar,
    cadastrar,
    atualizarDadoByUser,
    listarProfessores,
    inserirProfessor,
    deleteProfessor,
    deleteUser,
    atualizarProfessor,
    escolaUser
};