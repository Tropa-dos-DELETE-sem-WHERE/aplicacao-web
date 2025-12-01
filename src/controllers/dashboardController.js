var dashboardModel = require("../models/dashboardModel");

function histograma(req, res) {
    const idEscola = req.params.idEscola;

    dashboardModel.histograma(idEscola)
        .then(r => r.length ? res.json(r) : res.status(204).send("Vazio"))
        .catch(e => res.status(500).json(e));
}

function medianasEscola(req, res) {
    const idEscola = req.params.idEscola;

    dashboardModel.medianasEscola(idEscola)
        .then(r => r.length ? res.json(r[0]) : res.status(204).send("Vazio"))
        .catch(e => res.status(500).json(e));
}

function kpis(req, res) {
    const idEscola = req.params.idEscola;

    dashboardModel.kpis(idEscola)
        .then(r => {
            if (!r.length) return res.status(204).send("Sem dados");

            const dados = r[0];

            const materias = ["cn","ch","lp","mt","red"];

            // Maior / Menor Mediana
            let maior = materias.reduce((a,b)=>dados[a]>dados[b]?a:b);
            let menor = materias.reduce((a,b)=>dados[a]<dados[b]?a:b);

            // Diferença com Brasil
            let diffs = materias.map(m => ({
                materia: m,
                diff: Number(dados[m] - dados["br_"+m])
            }));

            let maiorDif = diffs.reduce((a,b)=>a.diff>b.diff?a:b);
            let menorDif = diffs.reduce((a,b)=>a.diff<b.diff?a:b);

            res.json({
                maiorMediana: maior,
                valorMaiorMediana: dados[maior],
                menorMediana: menor,
                valorMenorMediana: dados[menor],
                maiorDiferenca: maiorDif,
                menorDiferenca: menorDif
            });
        })
        .catch(e => res.status(500).json(e));
}

function medianas(req, res) {
    const idEscola = req.params.idEscola;

    dashboardModel.medianas(idEscola)
        .then(resultado => res.status(200).json(resultado[0]))
        .catch(erro => {
            console.log("Erro ao buscar medianas:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function medianasBrasil(req, res) {
    dashboardModel.medianasBrasil()
        .then(resultado => res.status(200).json(resultado[0]))
        .catch(erro => {
            console.log("Erro ao buscar medianas do Brasil:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    histograma,
    medianasEscola,
    kpis,
    medianasBrasil,
    medianas
};