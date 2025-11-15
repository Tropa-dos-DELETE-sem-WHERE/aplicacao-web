const metaModel = require("../models/metaModel");

function atualizar(req, res) {
    
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
        metaModel.atualizarDadoByUser(idInstituicao,nomeUsuario,email,idUsuario)
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
function inserirMeta(req, res) {
    const tituloMeta = req.body.tituloMeta;
    const dataLimite = req.body.dataLimite;
    const anotacao = req.body.anotacao;
    const idUsuario = req.body.idUsuario;
    const statusMeta = req.body.statusMeta;

    if (tituloMeta == undefined) {
        res.status(400).send("O titulo da meta está undefined!");
    } else if (dataLimite == undefined) {
        res.status(400).send("A dataLimite está undefined!");
    } else if (idUsuario == undefined) {
        res.status(400).send("O id do usuario está undefined!");
    } else if (statusMeta == undefined) {
        res.status(400).send("O status da Meta está undefined!");
    } else {
        metaModel.inserirProfessor(tituloMeta, dataLimite, anotacao, idUsuario, statusMeta)
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

function listar(req, res){
metaModel.listar().then(
    function (resultadoAutenticar) {
        console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
        console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);
        res.json(resultadoAutenticar)
    }).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro Listar os ! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
}

function apagar(req, res) {
    var idProfessor = req.body.idProfessor;

    metaModel.apagar(idProfessor)
        .then(function (resultado) {
            res.status(200).json({ mensagem: "Professor deletado com sucesso!" });
        })
        .catch(function (erro) {
            console.log("\nHouve um erro ao deletar o professor! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    listar,
    inserir,
    apagar,
    atualizar
}