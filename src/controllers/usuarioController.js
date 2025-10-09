const usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    const email = req.body.emailServer;
    const senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
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

function cadastrar(req, res) {
    
    const nomeInstituicao = req.body.nomeInstituicaoServer;
    const nomeUsuario = req.body.nomeUsuarioServer;
    const email = req.body.emailServer;
    const senha = req.body.senhaServer;
    const tipoUsuario = req.body.tipoUsuarioServer;

    // Faça as validações dos valores
    if (nomeInstituicao == undefined) {
        res.status(400).send("Nome da Instituição está undefined!");
    } else if (nomeUsuario == undefined) {
        res.status(400).send("Nome do Usuário está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (tipoUsuario == undefined) {
        res.status(400).send("Seu tipo de usuario está undefined!");
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

function atualizarDadoByUser(req, res) {
    
    const idInstituicao = req.body.idInstituicaoServer;
    const nomeUsuario = req.body.nomeUsuarioServer;
    const email = req.body.emailServer;
    const idUsuario = req.body.idUsuarioServer;
    
    // Faça as validações dos valores
    if (idInstituicao == undefined) {
        res.status(400).send("Nome da Instituição está undefined!");
    } else if (nomeUsuario == undefined) {
        res.status(400).send("Nome do Usuário está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (idUsuario == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else {
        usuarioModel.atualizarDadoByUser(idInstituicao,nomeUsuario,email,idUsuario)
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
}
module.exports = {
    autenticar,
    cadastrar,
    atualizarDadoByUser
}