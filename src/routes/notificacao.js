var express = require("express");
var router = express.Router();

var notificacaoController = require("../controllers/notificacaoController");


router.get("/listarSlack/:idUsuario", function(req, res) {
    console.log("aqui")
    notificacaoController.listarSlack(req, res);
});

router.patch("/solicitarCanal/:idUsuario", function (req, res) {
    notificacaoController.solicitarCanal(req, res);
});


module.exports = router;
