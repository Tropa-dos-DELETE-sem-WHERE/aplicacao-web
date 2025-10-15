var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.put("/atualizarDadoByUser", function (req, res) {
    usuarioController.atualizarDadoByUser(req, res);
});

router.post("/inserirProfessor", function(req, res) {
    usuarioController.inserirProfessor(req, res);
});

router.get("/listarProfessores", function(req, res) {
    usuarioController.listarProfessores(req, res);
});

router.delete("/deleteProfessores", function(req, res) {
    usuarioController.deleteProfessor(req, res);
});

module.exports = router;