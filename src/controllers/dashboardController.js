var dashboardModel = require("../models/dashboardModel");

function histograma(req, res) {
    const idEscola = parseInt(req.params.idEscola, 10);
    if (isNaN(idEscola)) return res.status(400).send("idEscola inválido");

    // aceitar opcionalmente ?materia_id= para aplicar bins específicos (ex: redação)
    const filtro = {
        escola: idEscola,
        materia_id: req.query.materia_id ? Number(req.query.materia_id) : undefined,
        tipoEscola_id: req.query.tipoEscola_id ? Number(req.query.tipoEscola_id) : undefined,
        UF_id: req.query.UF_id ? Number(req.query.UF_id) : undefined
    };

    dashboardModel.histogramaComFiltro(filtro)
        .then(r => {
            if (!r || !r.length) {
                return res.json({ bins: [], values: [] });
            }
            const bins = r.map(row => row.bins);
            const values = r.map(row => parseInt(Number(row.values), 10));
            return res.json({ bins, values });
        })
        .catch(e => res.status(500).json(e));
}

function histogramaComFiltro(req, res) {
    // aceita query params: escola, materia_id, tipoEscola_id, UF_id
    const filtro = {
        escola: req.query.escola ? Number(req.query.escola) : undefined,
        materia_id: req.query.materia_id ? Number(req.query.materia_id) : undefined,
        tipoEscola_id: req.query.tipoEscola_id ? Number(req.query.tipoEscola_id) : undefined,
        UF_id: req.query.UF_id ? Number(req.query.UF_id) : undefined
    };

    dashboardModel.histogramaComFiltro(filtro)
        .then(r => {
            if (!r || !r.length) return res.json({ bins: [], values: [] });
            const bins = r.map(row => row.bins);
            const values = r.map(row => parseInt(Number(row.values), 10));
            return res.json({ bins, values });
        })
        .catch(e => res.status(500).json(e));
}

function medianasEscola(req, res) {
    const idEscola = parseInt(req.params.idEscola, 10);
    if (isNaN(idEscola)) return res.status(400).send("idEscola inválido");

    dashboardModel.medianasEscola(idEscola)
        .then(r => r.length ? res.json(r[0]) : res.status(204).send("Vazio"))
        .catch(e => res.status(500).json(e));
}

function kpis(req, res) {
    const idEscola = parseInt(req.params.idEscola, 10);
    if (isNaN(idEscola)) return res.status(400).send("idEscola inválido");

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

function kpisComFiltro(req, res) {
    const filtro = {
        escola: req.query.escola ? Number(req.query.escola) : undefined,
        materia_id: req.query.materia_id ? Number(req.query.materia_id) : undefined,
        tipoEscola_id: req.query.tipoEscola_id ? Number(req.query.tipoEscola_id) : undefined,
        UF_id: req.query.UF_id ? Number(req.query.UF_id) : undefined
    };

    dashboardModel.kpisComFiltro(filtro)
        .then(r => {
            if (!r.length) return res.status(204).send("Sem dados");

            const dados = r[0];

            const materias = ["cn","ch","lp","mt","red"];

            let maior = materias.reduce((a,b)=>dados[a]>dados[b]?a:b);
            let menor = materias.reduce((a,b)=>dados[a]<dados[b]?a:b);

            let diffs = materias.map(m => ({
                materia: m,
                diff: Number(dados[m] - (dados["br_"+m] || 0))
            }));

            let maiorDif = diffs.reduce((a,b)=>Math.abs(a.diff)>Math.abs(b.diff)?a:b);
            let menorDif = diffs.reduce((a,b)=>Math.abs(a.diff)<Math.abs(b.diff)?a:b);

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
    const idEscola = parseInt(req.params.idEscola, 10);
    if (isNaN(idEscola)) return res.status(400).send("idEscola inválido");

    dashboardModel.medianas(idEscola)
        .then(resultado => {
            const row = resultado[0] || {};

            // montar estrutura para gráficos (labels/values) e retornar também os campos de mediana
            const labels = ['Matemática', 'Linguagens', 'Ciências Humanas', 'Ciências da Natureza', 'Redação'];
            const values = [row.mediana_mt || 0, row.mediana_lp || 0, row.mediana_ch || 0, row.mediana_cn || 0, row.mediana_red || 0];

            return res.status(200).json({
                mediana_cn: row.mediana_cn,
                mediana_ch: row.mediana_ch,
                mediana_lp: row.mediana_lp,
                mediana_mt: row.mediana_mt,
                mediana_red: row.mediana_red,
                labels,
                values
            });
        })
        .catch(erro => {
            console.log("Erro ao buscar medianas:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function medianasComFiltro(req, res) {
    const filtro = {
        escola: req.query.escola ? Number(req.query.escola) : undefined,
        materia_id: req.query.materia_id ? Number(req.query.materia_id) : undefined,
        tipoEscola_id: req.query.tipoEscola_id ? Number(req.query.tipoEscola_id) : undefined,
        UF_id: req.query.UF_id ? Number(req.query.UF_id) : undefined
    };

    dashboardModel.medianasComFiltro(filtro)
        .then(resultado => {
            const row = resultado[0] || {};
            const labels = ['Matemática', 'Linguagens', 'Ciências Humanas', 'Ciências da Natureza', 'Redação'];
            const values = [row.mediana_mt || 0, row.mediana_lp || 0, row.mediana_ch || 0, row.mediana_cn || 0, row.mediana_red || 0];

            return res.status(200).json({
                mediana_cn: row.mediana_cn,
                mediana_ch: row.mediana_ch,
                mediana_lp: row.mediana_lp,
                mediana_mt: row.mediana_mt,
                mediana_red: row.mediana_red,
                labels,
                values
            });
        })
        .catch(erro => {
            console.log("Erro ao buscar medianas com filtro:", erro);
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

function histogramaComparativo(req, res) {
    // Recebe: idEscolaUsuario (obrigatório) + filtro (materia_id, tipoEscola_id, UF_id)
    const idEscolaUsuario = parseInt(req.query.idEscolaUsuario, 10);
    if (isNaN(idEscolaUsuario)) return res.status(400).json({ erro: "idEscolaUsuario inválido" });

    const filtro = {
        // não passamos escola ao filtro, deixa comparar com filtro genérico
        materia_id: req.query.materia_id ? Number(req.query.materia_id) : undefined,
        tipoEscola_id: req.query.tipoEscola_id ? Number(req.query.tipoEscola_id) : undefined,
        UF_id: req.query.UF_id ? Number(req.query.UF_id) : undefined
    };

    dashboardModel.histogramaComparativo(filtro, idEscolaUsuario)
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log("Erro ao buscar histograma comparativo:", erro);
            res.status(500).json({ erro: erro.message || erro });
        });
}

module.exports = {
    histograma,
    medianasEscola,
    kpis,
    obterKPIs: kpis,
    medianasBrasil,
    medianas,
    // filter-capable handlers
    histogramaComFiltro,
    medianasComFiltro,
    kpisComFiltro,
    histogramaComparativo
};