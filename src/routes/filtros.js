var express = require("express");
var router = express.Router();

var filtrosController = require("../controllers/filtroController");

router.delete("/deletar", function(req, res) {
    filtrosController.deletar(req, res);
});

router.put("/atualizar/:id", function (req, res) {
    filtrosController.atualizar(req, res);
});

router.patch("/atualizarStatus/:id", function (req, res) {
    filtrosController.atualizarStatus(req, res);
});

router.post("/inserir", function(req, res) {
    filtrosController.inserir(req, res);
});

router.get("/listar/:idUsuario", function(req, res) {
    filtrosController.listarFiltrosByUsuario(req, res);
});

router.get("/materias", function(req, res) {
    filtrosController.listarMaterias(req, res);
});

router.get("/estados", function(req, res) {
    filtrosController.listarEstados(req, res);
});


router.get("/tiposEscola", function(req, res) {
    filtrosController.listarTiposEscola(req, res);
});

module.exports = router;