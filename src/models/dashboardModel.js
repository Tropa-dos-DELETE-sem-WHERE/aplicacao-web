var database = require("../database/config");

function obterHistograma(idEscola) {
    console.log("");

    var instrucaoSql = `
        SELECT 
            faixa_nota AS bins,
            quantidade AS values
        FROM (
            SELECT 
                CASE 
                    WHEN nota_cn < 400 THEN '0-400'
                    WHEN nota_cn >= 400 AND nota_cn < 500 THEN '400-500'
                    WHEN nota_cn >= 500 AND nota_cn < 600 THEN '500-600'
                    WHEN nota_cn >= 600 AND nota_cn < 700 THEN '600-700'
                    WHEN nota_cn >= 700 THEN '700+'
                END AS faixa_nota,
                COUNT(*) AS quantidade
            FROM registro
            WHERE escola_id = ${idEscola}
              AND ano = (SELECT MAX(ano) FROM registro WHERE escola_id = ${idEscola})
              AND nota_cn IS NOT NULL
            GROUP BY faixa_nota
        ) AS t
        ORDER BY 
            CASE faixa_nota
                WHEN '0-400' THEN 1
                WHEN '400-500' THEN 2
                WHEN '500-600' THEN 3
                WHEN '600-700' THEN 4
                WHEN '700+' THEN 5
            END;
    `;

    return database.executar(instrucaoSql);
}

function obterMedianasPorArea(idEscola) {
    console.log("");

    var instrucaoSql = `
       SELECT
            PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY nota_cn) AS mediana_cn,
            PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY nota_ch) AS mediana_ch,
            PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY nota_lp) AS mediana_lp,
            PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY nota_mt) AS mediana_mt,
            PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY nota_red) AS mediana_red
        FROM registro
        WHERE escola_id = ${idEscola}
          AND ano = (SELECT MAX(ano) FROM registro WHERE escola_id = ${idEscola});
    `;

    return database.executar(instrucaoSql);
}

    
function obterKPIs(idEscola) {
    console.log("");

    const instrucaoSql = `
      WITH escola AS (
            SELECT
                PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY nota_cn) AS cn,
                PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY nota_ch) AS ch,
                PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY nota_lp) AS lp,
                PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY nota_mt) AS mt,
                PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY nota_red) AS red
            FROM registro
            WHERE escola_id = ${idEscola}
              AND ano = (SELECT MAX(ano) FROM registro WHERE escola_id = ${idEscola})
        ),
        brasil AS (
            SELECT mediana_cn AS cn, mediana_ch AS ch, mediana_lp AS lp,
                   mediana_mt AS mt, mediana_red AS red
            FROM estatistica_macro
            WHERE categoria = 'BRASIL'
              AND ano = (SELECT MAX(ano) FROM estatistica_macro)
        )
        SELECT 
            e.cn, e.ch, e.lp, e.mt, e.red,
            b.cn AS br_cn, b.ch AS br_ch, b.lp AS br_lp, b.mt AS br_mt, b.red AS br_red
        FROM escola e CROSS JOIN brasil b;
    `; 

    return database.executar(instrucaoSql);
}

function medianas(idEscola) {
    const query = `
        SELECT 
            PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY nota_cn) AS mediana_cn,
            PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY nota_ch) AS mediana_ch,
            PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY nota_lp) AS mediana_lp,
            PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY nota_mt) AS mediana_mt,
            PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY nota_red) AS mediana_red
        FROM registro
        WHERE escola_id = ${idEscola}
        AND ano = (SELECT MAX(ano) FROM registro WHERE escola_id = ${idEscola});
    `;

    return database.executar(query);
}

function medianasBrasil() {
    const query = `
        SELECT 
            mediana_cn,
            mediana_ch,
            mediana_lp,
            mediana_mt,
            mediana_red
        FROM estatistica_macro
        WHERE categoria = 'BRASIL'
        ORDER BY ano DESC
        LIMIT 1;
    `;

    return database.executar(query);
}

module.exports = {
    obterHistograma,
    obterMedianasPorArea,
    obterKPIs,
    medianasBrasil,
    medianas
}