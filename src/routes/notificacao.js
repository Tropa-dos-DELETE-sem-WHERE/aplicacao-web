var express = require("express");
var router = express.Router();

var notificacaoController = require("../controllers/notificacaoController");


router.get("/listarSlack/:idUsuario", function(req, res) {
    console.log("aqui")
    notificacaoController.listarSlack(req, res);
});

router.get("/listarTodosSlack", function(req, res) {
    console.log("aqui")
    notificacaoController.listarTodosSlack(req, res);
});

router.patch("/alterarStatusCanal", function (req, res) {
    notificacaoController.alterarStatusCanal(req, res);
});


router.patch("/alterarWebhook/:idSlack", function (req, res) {
    notificacaoController.alterarWebhookCanal(req, res);
});


router.patch("/ligarDelisgar/:idSlack", function (req, res) {
    notificacaoController.ligarDelisgar(req, res);
});

router.patch("/alterarLogs/:idSlack", function (req, res) {
    notificacaoController.alterarLogsCanal(req, res);
});


router.patch("/alterarMediana/:idSlack", function (req, res) {
    notificacaoController.alterarMedianaCanal(req, res);
});


router.patch("/alterarIntervalo/:idSlack", function (req, res) {
    notificacaoController.alterarIntervaloCanal(req, res);
});





module.exports = router;
