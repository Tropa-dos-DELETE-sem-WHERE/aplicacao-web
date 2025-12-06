var express = require("express");
var router = express.Router();
var dashboardController = require("../controllers/dashboardController");

router.get("/histograma/:idEscola", function (req, res) {
    dashboardController.histograma(req, res);
});

router.get("/histograma", function (req, res) {
    dashboardController.histogramaComFiltro(req, res);
});

router.get("/histogramaComparativo", function (req, res) {
    dashboardController.histogramaComparativo(req, res);
});

router.get("/medianas/:idEscola", function (req, res) {
    dashboardController.medianas(req, res);
});

router.get("/medianasEscola/:idEscola", function (req, res) {
    dashboardController.medianasEscola(req, res);
});

router.get("/medianasComFiltro", function (req, res) {
    dashboardController.medianasComFiltro(req, res);
});

router.get("/medianasBrasil", function (req, res) {
    dashboardController.medianasBrasil(req, res);
});

router.get("/kpis/:idEscola", function (req, res) {
    dashboardController.kpis(req, res);
});

router.get("/obterKPIs/:idEscola", function (req, res) {
    dashboardController.obterKPIs(req, res);
});

router.get("/kpisComFiltro", function (req, res) {
    dashboardController.kpisComFiltro(req, res);
});

module.exports = router;