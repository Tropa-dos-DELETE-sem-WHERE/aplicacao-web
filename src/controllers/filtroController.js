const filtroModel = require("../models/filtroModel");

function atualizar(req, res) {
    const id = req.params.id;
    const nomeFiltro = req.body.nomeFiltro;
    const materia_id = req.body.materia_id;
    const tipoEscola_id = req.body.tipoEscola_id;
    const UF_id = req.body.UF_id;
    const idUsuario = req.body.idUsuario;

    console.log("Controller atualizar filtro recebendo:");
    console.log("id:", id);
    console.log("nomeFiltro:", nomeFiltro);
    console.log("materia_id:", materia_id);
    console.log("tipoEscola_id:", tipoEscola_id);
    console.log("UF_id:", UF_id);
    console.log("idUsuario:", idUsuario);

    filtroModel.atualizar(nomeFiltro, materia_id, tipoEscola_id, UF_id, idUsuario, id)
        .then(resultado => {
            res.json(resultado);
        })
        .catch(erro => {
            if (!nomeFiltro || !materia_id || !tipoEscola_id || !UF_id || !idUsuario || !id) {
                res.status(400).send("Algum dos campos está vazio, preencha corretamente");
            } else {
                res.status(500).json(erro.sqlMessage);
            }
        });
}

function atualizarStatus(req, res) {
    const id = req.params.id;
    const idUsuario = req.body.idUsuario;

    console.log("Estou no controller passando os seguintes dados");
    console.log(id);
    console.log(idUsuario);

    filtroModel.atualizarStatus(id,idUsuario)
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
    const nomeFiltro = req.body.nomeFiltro;
    const materia_id = req.body.materia_id;
    const tipoEscola_id = req.body.tipoEscola_id;
    const UF_id = req.body.UF_id;
    const usuario_id = req.body.usuario_id;
    const emUso = req.body.emUso;

    console.log("Estou no controller passando os seguintes dados");
    console.log(nomeFiltro);
    console.log(materia_id);
    console.log(tipoEscola_id);
    console.log(UF_id);
    console.log(usuario_id);
    console.log(emUso);

    filtroModel.inserir(nomeFiltro, materia_id, tipoEscola_id, UF_id, usuario_id, emUso)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                if (nomeFiltro == "" || materia_id == "" || tipoEscola_id == "" || UF_id == "" || usuario_id == "") {
                    res.status(400).send("Algum dos campos está vazio, preencha corretamente");
                } else {
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



function deletarFiltro(req, res) {
    const id = req.body.idFiltro;
    const idUsuario = req.body.idUsuario;
    console.log(id);
    if (idUsuario == undefined) {
        res.status(400).send("O id da  está undefined!");
    }else if (idUsuario == undefined) {
        res.status(400).send("O idUsuario da  está undefined!");
    }else{
        filtroModel.deletarFiltro(id,idUsuario)
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
    deletarFiltro,
    atualizar,
    atualizarStatus,
    listarMaterias,
    listarEstados,
    listarTiposEscola
}