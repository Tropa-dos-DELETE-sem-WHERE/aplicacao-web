const filtroModel = require("../models/filtroModel");

function atualizar(req, res) {
    const id = req.params.id;
    const titulo = req.body.titulo;
    const dataLimite = req.body.dataLimite;
    const anotacao = req.body.anotacao;
    const idUsuario = req.body.idUsuario;
    const status = req.body.status;
    console.log("Estou no controller passando os seguintes dados");
    console.log(titulo);
    console.log(dataLimite);
    console.log(anotacao);
    console.log(idUsuario);
    console.log(status);
    console.log(id);
    filtroModel.atualizar(titulo, dataLimite, anotacao, idUsuario, status,id)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                if(titulo == "" || dataLimite == "" || idUsuario == "" || id == "")
                {
                    res.status(400).send("Algum dos campos está vazio preencha corretamente");
                }else{
                    res.status(500).json(erro.sqlMessage);
                }
            }
        );
}
function atualizarStatus(req, res) {
    const id = req.params.id;
    const status = req.body.status;
    const idUsuario = req.body.idUsuario;

    console.log("Estou no controller passando os seguintes dados");
    console.log(status);
    console.log(id);
    console.log(idUsuario);

    filtroModel.atualizarStatus(status,id,idUsuario)
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
function inserir(req, res) {
    const titulo = req.body.titulo;
    const dataLimite = req.body.dataLimite;
    const anotacao = req.body.anotacao;
    const idUsuario = req.body.idUsuario;
    const status = req.body.status;
    console.log("Estou no controller passando os seguintes dados");
    console.log(titulo);
    console.log(dataLimite);
    console.log(anotacao);
    console.log(idUsuario);
    console.log(status);
    filtroModel.inserir(titulo, dataLimite, anotacao, idUsuario, status)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                if(titulo == "" || dataLimite == "" || idUsuario == "")
                {
                    res.status(400).send("Algum dos campos está vazio preencha corretamente");
                }else{
                    res.status(500).json(erro.sqlMessage);
                }
            }
        );
}

function listarFiltrosByUsuario(req, res) {
    const idUsuario = req.params.idUsuario;
    if (idUsuario == undefined) {
        res.status(400).send("O idUsuario está undefined!");
    } else {
        console.log("Estou no controller passando os seguintes dados:");
        console.log(idUsuario);

        filtroModel.listarFiltrosByUsuario(idUsuario)
            .then(function (resultado) {
                console.log(`\nResultados encontrados: ${resultado.length}`);
                console.log(`Resultados: ${JSON.stringify(resultado)}`);
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao listar os filtros! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}



function deletar(req, res) {
    const id = req.body.id;
    const idUsuario = req.body.idUsuario;
    console.log(id);
    if (idUsuario == undefined) {
        res.status(400).send("O id da  está undefined!");
    }else if (idUsuario == undefined) {
        res.status(400).send("O idUsuario da  está undefined!");
    }else{
        filtroModel.deletar(id,idUsuario)
        .then(function() {
            res.status(200).json({ mensagem: " deletada com sucesso!" });
        })
        .catch(function (erro) {
            console.log("\nHouve um erro ao deletar a ! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
    }
}

function listarMaterias(req, res) {
    console.log("Listando matérias...");
    filtroModel.listarMaterias()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            res.status(500).json(erro.sqlMessage);
        });
}

function listarEstados(req, res) {
    console.log("Listando estados...");
    filtroModel.listarEstados()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao listar os estados! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function listarTiposEscola(req, res) {
    console.log("Listando tipos de escola...");
    filtroModel.listarTiposEscola()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao listar os tipos de escola! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    listarFiltrosByUsuario,
    inserir,
    deletar,
    atualizar,
    atualizarStatus,
    listarMaterias,
    listarEstados,
    listarTiposEscola
}