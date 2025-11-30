var express = require("express");
var router = express.Router();
var dashboardController = require("../controllers/dashboardController");

router.get("/histograma/:idEscola", function (req, res){
    dashboardController.histograma(req, res);
});

router.get("/medianas/:idEscola", function (req, res){
    dashboardController.medianas(req, res);
});

router.get("/kpis/:idEscola", function (req, res) {
    dashboardController.obterKPIs(req, res);
});

module.exports = router;