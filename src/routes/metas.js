var express = require("express");
var router = express.Router();

var metasController = require("../controllers/metaController");

router.delete("/delete", function(req, res) {
    metasController.deleteUser(req, res);
});

router.put("/atualizar", function (req, res) {
    metasController.atualizar(req, res);
});

router.post("/inserirMeta", function(req, res) {
    metasController.inserir(req, res);
});

router.get("/listar", function(req, res) {
    metasController.listar(req, res);
});

module.exports = router;