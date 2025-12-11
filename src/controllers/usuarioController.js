const usuarioModel = require("../models/usuarioModel");

// Autenticando usuário
function autenticar(req, res) {
    const email = req.body.emailServer;
    const senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está indefinido!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String
                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);
                            res.json({
                                id: resultadoAutenticar[0].id,
                                email: resultadoAutenticar[0].email,
                                nome: resultadoAutenticar[0].nome,
                                senha: resultadoAutenticar[0].senha,
                                escola_id: resultadoAutenticar[0].escola_id,
                                tipoUsuario_id: resultadoAutenticar[0].tipoUsuario_id
                            });
                                
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo email!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}


// Cadastrando usuário 
function cadastrar(req, res) {
    
    const nomeInstituicao = req.body.nomeInstituicaoServer;
    const nomeUsuario = req.body.nomeUsuarioServer;
    const email = req.body.emailServer;
    const senha = req.body.senhaServer;
    const tipoUsuario = req.body.tipoUsuarioServer;

    // Faça as validações dos valores
    if (nomeInstituicao == undefined) {
        res.status(400).send("Nome da Instituição está indefinido!");
    } else if (nomeUsuario == undefined) {
        res.status(400).send("Nome do Usuário está indefinido!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está indefinido!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else if (tipoUsuario == undefined) {
        res.status(400).send("Seu tipo de usuario está indefinido!");
    } else {
        usuarioModel.cadastrar(nomeInstituicao,nomeUsuario,email,senha,tipoUsuario)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
                
            ).catch(
                function (erro) {
                      console.log("Erro:", erro);
                    if(erro.tipo == "escola_nao_encontrada")
                        {
                          return res.status(404).json(erro);
                        }
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

//Atualizandos os dados do usuário
function atualizarDadoByUser(req, res) {
    
    const senha = req.body.senhaServer;
    const nomeUsuario = req.body.nomeUsuarioServer;
    const email = req.body.emailServer;
    const idUsuario = req.body.idUsuario;
    console.log(idUsuario);
    console.log(nomeUsuario);
    console.log(email);
    console.log(senha);
        usuarioModel.atualizarDadoByUser(senha,nomeUsuario,email,idUsuario)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                      console.log("Erro:", erro);
                    res.status(500).json(erro.sqlMessage);
                }
            );
}

// Inserindo os professores 

// ATENCAO: Atualizar depois para a nova regra de negócio!
function inserirProfessor(req, res) {
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;
    const tipoUsuario = req.body.tipoUsuario;
    const escola_id = req.body.escola_id;

    if (nome == "") {
        res.status(400).send("O nome está indefinido!");
    } else if (email == "") {
        res.status(400).send("O email está indefinido!");
    } else if (senha == "") {
        res.status(400).send("A senha está indefinida!");
    } else if (tipoUsuario == "") {
        res.status(400).send("O tipo de usuário está indefinido!");
    } else if (escola_id == undefined) {
        res.status(400).send("O ID da escola está indefinido!");
    } else {
        usuarioModel.inserirProfessor(nome, email, senha, tipoUsuario, escola_id)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            )
            .catch(
                function (erro) {
                    console.log("Erro:", erro);
                    if (erro.tipo == "escola_nao_encontrada") {
                        return res.status(404).json(erro);
                    }
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}


// Listando os professores 
function listarProfessores(req, res){
usuarioModel.listarProfessores().then(
    function (resultadoAutenticar) {
        console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
        console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);
        res.json(resultadoAutenticar)
    }).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro Listar os professores! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
}


// Validando usuário
function escolaUser(req, res) {
    const idUsuario = req.params.idUsuario;
    if (idUsuario == undefined) {
        res.status(400).send("O id do Usuário está indefinido!");
    } else {
        usuarioModel.escolaUser(idUsuario)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            )
            .catch(
                function (erro) {
                    console.log("Erro:", erro);
                    if (erro.tipo == "escola_nao_encontrada") {
                        return res.status(404).json(erro);
                    }
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

// Deletando usuário 
function deleteUser(req, res) {
    var id = req.body.id;

    usuarioModel.deleteUser(id)
        .then(function (resultado) {
            res.status(200).json({ mensagem: "Usuario deletado com sucesso!" });
        })
        .catch(function (erro) {
            console.log("\nHouve um erro ao deletar o Usuario! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

// Deletando os professores 
function deleteProfessor(req, res) {
    var idProfessor = req.body.idProfessor;

    usuarioModel.deleteProfessor(idProfessor)
        .then(function (resultado) {
            res.status(200).json({ mensagem: "Professor deletado com sucesso!" });
        })
        .catch(function (erro) {
            console.log("\nHouve um erro ao deletar o professor! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

// Atualizando os professores 
function atualizarProfessor(req, res) {
    const id = req.params.id;
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;

    if (!id) {
        return res.status(400).send("O ID está undefined!");
    } else if (!nome) {
        return res.status(400).send("O nome está undefined!");
    } else if (!email) {
        return res.status(400).send("O email está undefined!");
    } else if (!senha) {
        return res.status(400).send("A senha está undefined!");
    } else {
        usuarioModel.atualizarProfessor(id, nome, email, senha)
            .then((resultado) => {
                res.json(resultado);
            })
            .catch((erro) => {
                console.error("Erro:", erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    autenticar,
    cadastrar,
    atualizarDadoByUser,
    listarProfessores,
    inserirProfessor,
    deleteProfessor,
    atualizarProfessor,
    deleteUser,
    escolaUser
}