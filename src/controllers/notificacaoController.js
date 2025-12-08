const notificacaoModel = require("../models/notificacaoModel");

function listarSlack(req, res){
const idUsuario = req.params.idUsuario;
    if (idUsuario == undefined) {
        res.status(400).send("O idUsuario da meta está undefined!");
    }else {
            console.log("Estou no controller passando os seguintes dados");
            console.log(idUsuario);
            notificacaoModel.listarSlack(idUsuario).then(
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

function solicitarCanal(req, res) {
console.log("Estou no controller passando os seguintes dados");
    const canal = req.body.canal[0];
    const idslack = canal.idslack;
    const solicitou = "pendente";
    const usuario_id = canal.usuario_id;
    const idUsuarioLogado = req.params.idUsuario;

    notificacaoModel.solicitarCanal(idslack, solicitou, usuario_id,idUsuarioLogado)
    .then(function (resultado) {
        res.json(resultado);
    })
    .catch(function (erro) {
        res.status(500).json(erro.sqlMessage);
    });
}


module.exports = {
    listarSlack,
    solicitarCanal
}