var express = require("express");
var router = express.Router();

var metasController = require("../controllers/metaController");

router.delete("/deletarMeta", function(req, res) {
    metasController.deletarMeta(req, res);
});

router.put("/atualizarMeta/:idMeta", function (req, res) {
    metasController.atualizarMeta(req, res);
});

router.patch("/atualizarStatusMeta/:idMeta", function (req, res) {
    metasController.atualizarStatusMeta(req, res);
});

router.post("/inserirMeta", function(req, res) {
    metasController.inserirMeta(req, res);
});

router.get("/listarMeta/:idUsuario/:status?", function(req, res) {
    metasController.listarMetaByUsuario(req, res);
});


module.exports = router;