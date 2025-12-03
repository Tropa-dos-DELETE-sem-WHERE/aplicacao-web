var express = require("express");
var router = express.Router();
var dashboardController = require("../controllers/dashboardController");

router.get("/histograma/:idEscola", function (req, res){
    dashboardController.histograma(req, res);
});

// histograma com filtros via query string: ?escola=...&materia_id=...&tipoEscola_id=...&UF_id=...
router.get("/histograma", function (req, res){
    dashboardController.histogramaComFiltro(req, res);
});

// histograma comparativo: filtro vs escola do usuário
router.get("/histogramaComparativo", function (req, res){
    dashboardController.histogramaComparativo(req, res);
});

router.get("/medianas/:idEscola", function (req, res){
    dashboardController.medianas(req, res);
});

router.get("/medianas", function (req, res){
    dashboardController.medianasComFiltro(req, res);
});

router.get("/medianas-brasil", function (req, res){
    dashboardController.medianasBrasil(req, res);
});

router.get("/kpis/:idEscola", function (req, res) {
    dashboardController.obterKPIs(req, res);
});

router.get("/kpis", function (req, res) {
    dashboardController.kpisComFiltro(req, res);
});

module.exports = router;