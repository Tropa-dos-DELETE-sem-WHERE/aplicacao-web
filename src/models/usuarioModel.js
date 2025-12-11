var database = require("../database/config")

// Autenticando o usuário
function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT * FROM usuario WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Autenticando o usuário para identificar se há a existência da escola no banco de dados da empresa
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
  return await database.executar(sqlFiltro);

}

// Cadastrando o usuário com suas devidas credenciais
function atualizarDadoByUser(senha,nomeUsuario,email,idUsuario) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function atualizarDadoByUser(): ",senha,nomeUsuario,email,idUsuario)
    var instrucaoSql = `
        UPDATE usuario
        SET nome = '${nomeUsuario}', email = '${email}', senha = ${senha}
        WHERE id = ${idUsuario}; 
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Listando os professores existententes no banco

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
            SELECT 
            u.nome,
            u.email,
            u.senha,
            e.*
        FROM usuario AS u
        JOIN escola AS e 
            ON u.escola_id = e.codigoEscola
        WHERE u.id = ${idUsuario};

    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Inserindo professor no login 
function inserirProfessor(nome, email, senha, tipoUsuario, escola_id) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function inserirProfessor(): ", nome, email, senha, tipoUsuario, escola_id);

    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, escola_id, tipoUsuario_id)
        VALUES ('${nome}', '${email}', '${senha}', ${escola_id},${tipoUsuario});
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


// Deletando professor do login 
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

// Atualizar professor do login
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

// Exportando funções
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