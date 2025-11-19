const metaModel = require("../models/metaModel");

function atualizarMeta(req, res) {
    const idMeta = req.params.idMeta;
    const tituloMeta = req.body.tituloMeta;
    const dataLimite = req.body.dataLimite;
    const anotacao = req.body.anotacao;
    const idUsuario = req.body.idUsuario;
    const statusMeta = req.body.statusMeta;
    console.log("Estou no controller passando os seguintes dados");
    console.log(tituloMeta);
    console.log(dataLimite);
    console.log(anotacao);
    console.log(idUsuario);
    console.log(statusMeta);
    console.log(idMeta);
    metaModel.atualizarMeta(tituloMeta, dataLimite, anotacao, idUsuario, statusMeta,idMeta)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                if(tituloMeta == "" || dataLimite == "" || idUsuario == "" || idMeta == "")
                {
                    res.status(400).send("Algum dos campos está vazio preencha corretamente");
                }else{
                    res.status(500).json(erro.sqlMessage);
                }
            }
        );
}
function atualizarStatusMeta(req, res) {
    const idMeta = req.params.idMeta;
    const statusMeta = req.body.statusMeta;
    const idUsuario = req.body.idUsuario;

    console.log("Estou no controller passando os seguintes dados");
    console.log(statusMeta);
    console.log(idMeta);
    console.log(idUsuario);

    metaModel.atualizarStatusMeta(statusMeta,idMeta,idUsuario)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                res.status(500).json(erro.sqlMessage);
            }
        );
}
function inserirMeta(req, res) {
    const tituloMeta = req.body.tituloMeta;
    const dataLimite = req.body.dataLimite;
    const anotacao = req.body.anotacao;
    const idUsuario = req.body.idUsuario;
    const statusMeta = req.body.statusMeta;
    console.log("Estou no controller passando os seguintes dados");
    console.log(tituloMeta);
    console.log(dataLimite);
    console.log(anotacao);
    console.log(idUsuario);
    console.log(statusMeta);
    metaModel.inserirMeta(tituloMeta, dataLimite, anotacao, idUsuario, statusMeta)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                if(tituloMeta == "" || dataLimite == "" || idUsuario == "")
                {
                    res.status(400).send("Algum dos campos está vazio preencha corretamente");
                }else{
                    res.status(500).json(erro.sqlMessage);
                }
            }
        );
}

function listarMetaByUsuario(req, res){
const idUsuario = req.params.idUsuario;
const status = req.params.status;
    if (idUsuario == undefined) {
        res.status(400).send("O idUsuario da meta está undefined!");
    }else {
            console.log("Estou no controller passando os seguintes dados");
            console.log(idUsuario);
            metaModel.listarMetaByUsuario(idUsuario,status).then(
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
}



function deletarMeta(req, res) {
    const idMeta = req.body.idMeta;
    const idUsuario = req.body.idUsuario;
    console.log(idMeta);
    if (idUsuario == undefined) {
        res.status(400).send("O idMeta da meta está undefined!");
    }else if (idUsuario == undefined) {
        res.status(400).send("O idUsuario da meta está undefined!");
    }else{
        metaModel.deletarMeta(idMeta,idUsuario)
        .then(function() {
            res.status(200).json({ mensagem: "Meta deletada com sucesso!" });
        })
        .catch(function (erro) {
            console.log("\nHouve um erro ao deletar a meta! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
    }
}

module.exports = {
    listarMetaByUsuario,
    inserirMeta,
    deletarMeta,
    atualizarMeta,
    atualizarStatusMeta
}