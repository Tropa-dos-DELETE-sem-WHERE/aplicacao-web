var database = require("../database/config");

function calcularMediana(valores) {
    if (valores.length === 0) return null;
    const sorted = valores.sort((a, b) => a - b);
    const meio = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[meio - 1] + sorted[meio]) / 2;
    }
    return sorted[meio];
}

function histograma(idEscola) {
    var instrucaoSql = `
        SELECT 
            faixa_nota AS bins,
            quantidade AS \`values\`
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

function medianasEscola(idEscola) {
    var instrucaoSql = `
        SELECT 
            nota_cn,
            nota_ch,
            nota_lp,
            nota_mt,
            nota_red
        FROM registro
        WHERE escola_id = ${idEscola}
          AND ano = (SELECT MAX(ano) FROM registro WHERE escola_id = ${idEscola})
          AND (nota_cn IS NOT NULL OR nota_ch IS NOT NULL OR nota_lp IS NOT NULL 
               OR nota_mt IS NOT NULL OR nota_red IS NOT NULL);
    `;

    return database.executar(instrucaoSql).then(resultado => {
        const notas_cn = resultado.map(r => parseFloat(r.nota_cn)).filter(n => !isNaN(n));
        const notas_ch = resultado.map(r => parseFloat(r.nota_ch)).filter(n => !isNaN(n));
        const notas_lp = resultado.map(r => parseFloat(r.nota_lp)).filter(n => !isNaN(n));
        const notas_mt = resultado.map(r => parseFloat(r.nota_mt)).filter(n => !isNaN(n));
        const notas_red = resultado.map(r => parseFloat(r.nota_red)).filter(n => !isNaN(n));

        return [{
            mediana_cn: calcularMediana(notas_cn),
            mediana_ch: calcularMediana(notas_ch),
            mediana_lp: calcularMediana(notas_lp),
            mediana_mt: calcularMediana(notas_mt),
            mediana_red: calcularMediana(notas_red)
        }];
    });
}

function kpis(idEscola) {
    var instrucaoSqlEscola = `
        SELECT 
            nota_cn,
            nota_ch,
            nota_lp,
            nota_mt,
            nota_red
        FROM registro
        WHERE escola_id = ${idEscola}
          AND ano = (SELECT MAX(ano) FROM registro WHERE escola_id = ${idEscola});
    `;
    
    var instrucaoSqlBrasil = `
        SELECT 
            mediana_cn,
            mediana_ch,
            mediana_lp,
            mediana_mt,
            mediana_red
        FROM estatistica_macro
        WHERE categoria = 'BRASIL'
          AND ano = (SELECT MAX(ano) FROM estatistica_macro WHERE categoria = 'BRASIL')
        LIMIT 1;
    `;

    return Promise.all([
        database.executar(instrucaoSqlEscola),
        database.executar(instrucaoSqlBrasil)
    ]).then(([resultadoEscola, resultadoBrasil]) => {
        const notas_cn = resultadoEscola.map(r => parseFloat(r.nota_cn)).filter(n => !isNaN(n));
        const notas_ch = resultadoEscola.map(r => parseFloat(r.nota_ch)).filter(n => !isNaN(n));
        const notas_lp = resultadoEscola.map(r => parseFloat(r.nota_lp)).filter(n => !isNaN(n));
        const notas_mt = resultadoEscola.map(r => parseFloat(r.nota_mt)).filter(n => !isNaN(n));
        const notas_red = resultadoEscola.map(r => parseFloat(r.nota_red)).filter(n => !isNaN(n));

        const brasil = resultadoBrasil[0] || {};

        return [{
            cn: calcularMediana(notas_cn),
            ch: calcularMediana(notas_ch),
            lp: calcularMediana(notas_lp),
            mt: calcularMediana(notas_mt),
            red: calcularMediana(notas_red),
            br_cn: brasil.mediana_cn ? parseFloat(brasil.mediana_cn) : null,
            br_ch: brasil.mediana_ch ? parseFloat(brasil.mediana_ch) : null,
            br_lp: brasil.mediana_lp ? parseFloat(brasil.mediana_lp) : null,
            br_mt: brasil.mediana_mt ? parseFloat(brasil.mediana_mt) : null,
            br_red: brasil.mediana_red ? parseFloat(brasil.mediana_red) : null
        }];
    });
}

function medianas(idEscola) {
    return medianasEscola(idEscola);
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

function colunaPorEstatistica(estatistica_macro_id) {
    switch (Number(estatistica_macro_id)) {
        case 1: return 'nota_cn';
        case 2: return 'nota_ch';
        case 3: return 'nota_lp';
        case 4: return 'nota_mt';
        case 5: return 'nota_red';
        default: return 'nota_cn';
    }
}

function montarCondicoesFiltro(filtro) {
    const where = [];
    let joinEscola = false;

    if (filtro.escola) {
        where.push(`r.escola_id = ${filtro.escola}`);
    }
    if (filtro.tipoEscola_id) {
        joinEscola = true;
        where.push(`e.tipoEscola_id = ${filtro.tipoEscola_id}`);
    }
    if (filtro.UF_id) {
        joinEscola = true;
        where.push(`e.UF_id = ${filtro.UF_id}`);
    }

    return { 
        whereClause: where.length ? 'WHERE ' + where.join(' AND ') : '', 
        joinEscola 
    };
}

function ajustarAliasesWhere(whereClause, fromAlias, toAlias) {
    if (!whereClause) return '';
    return whereClause.replace(new RegExp(`\\b${fromAlias}\\.`, 'g'), `${toAlias}.`);
}

function construirCaseFaixa(coluna) {
    if (coluna === 'nota_red') {
        return {
            caseExpr: `
                CASE
                    WHEN r.${coluna} < 400 THEN '0-400'
                    WHEN r.${coluna} >= 400 AND r.${coluna} < 500 THEN '400-500'
                    WHEN r.${coluna} >= 500 AND r.${coluna} < 600 THEN '500-600'
                    WHEN r.${coluna} >= 600 AND r.${coluna} < 700 THEN '600-700'
                    WHEN r.${coluna} >= 700 AND r.${coluna} < 800 THEN '700-800'
                    WHEN r.${coluna} >= 800 AND r.${coluna} < 900 THEN '800-900'
                    WHEN r.${coluna} >= 900 AND r.${coluna} < 1000 THEN '900-1000'
                    WHEN r.${coluna} >= 1000 THEN '1000+'
                END AS faixa_nota`,
            orderExpr: `
                CASE faixa_nota
                    WHEN '0-400' THEN 1
                    WHEN '400-500' THEN 2
                    WHEN '500-600' THEN 3
                    WHEN '600-700' THEN 4
                    WHEN '700-800' THEN 5
                    WHEN '800-900' THEN 6
                    WHEN '900-1000' THEN 7
                    WHEN '1000+' THEN 8
                END`,
            bins: ['0-400', '400-500', '500-600', '600-700', '700-800', '800-900', '900-1000', '1000+']
        };
    }
    return {
        caseExpr: `
            CASE
                WHEN r.${coluna} < 400 THEN '0-400'
                WHEN r.${coluna} >= 400 AND r.${coluna} < 500 THEN '400-500'
                WHEN r.${coluna} >= 500 AND r.${coluna} < 600 THEN '500-600'
                WHEN r.${coluna} >= 600 AND r.${coluna} < 700 THEN '600-700'
                WHEN r.${coluna} >= 700 THEN '700+'
            END AS faixa_nota`,
        orderExpr: `
            CASE faixa_nota
                WHEN '0-400' THEN 1
                WHEN '400-500' THEN 2
                WHEN '500-600' THEN 3
                WHEN '600-700' THEN 4
                WHEN '700+' THEN 5
            END`,
        bins: ['0-400', '400-500', '500-600', '600-700', '700+']
    };
}

function histogramaComparativo(filtro, idEscolaUsuario) {
    const coluna = filtro.estatistica_macro_id ? colunaPorEstatistica(filtro.estatistica_macro_id) : 'nota_cn';
    const cond = montarCondicoesFiltro(filtro);
    const { caseExpr, orderExpr, bins } = construirCaseFaixa(coluna);

    // Query para buscar o ano mais recente do filtro
    const anoWhere = cond.whereClause ? ajustarAliasesWhere(cond.whereClause, 'r', 'r2') : '';
    const anoQuery = cond.joinEscola ?
        `SELECT MAX(r2.ano) FROM registro r2 JOIN escola e2 ON r2.escola_id = e2.codigoEscola ${anoWhere}` :
        `SELECT MAX(r2.ano) FROM registro r2 ${anoWhere}`;

    const sqlFiltro = `
        SELECT faixa_nota AS bins, quantidade AS \`values\`
        FROM (
            SELECT ${caseExpr.replace(/\n/g, ' ')}, COUNT(*) AS quantidade
            FROM registro r
            ${cond.joinEscola ? 'JOIN escola e ON r.escola_id = e.codigoEscola' : ''}
            ${cond.whereClause ? cond.whereClause + ' AND' : 'WHERE'}
              r.ano = (${anoQuery})
              AND r.${coluna} IS NOT NULL
            GROUP BY faixa_nota
        ) AS t
        ORDER BY ${orderExpr.replace(/\n/g, ' ')};
    `;

    const sqlEscola = `
        SELECT faixa_nota AS bins, quantidade AS \`values\`
        FROM (
            SELECT ${caseExpr.replace(/\n/g, ' ')}, COUNT(*) AS quantidade
            FROM registro r
            WHERE r.escola_id = ${idEscolaUsuario}
              AND r.ano = (SELECT MAX(ano) FROM registro WHERE escola_id = ${idEscolaUsuario})
              AND r.${coluna} IS NOT NULL
            GROUP BY faixa_nota
        ) AS t
        ORDER BY ${orderExpr.replace(/\n/g, ' ')};
    `;

    return Promise.all([
        database.executar(sqlFiltro),
        database.executar(sqlEscola)
    ]).then(([resultadoFiltro, resultadoEscola]) => {
        const mapFiltro = {};
        const mapEscola = {};
        
        resultadoFiltro.forEach(row => { mapFiltro[row.bins] = parseInt(row.values, 10); });
        resultadoEscola.forEach(row => { mapEscola[row.bins] = parseInt(row.values, 10); });

        return {
            bins: bins,
            dataFiltro: bins.map(bin => mapFiltro[bin] || 0),
            dataEscola: bins.map(bin => mapEscola[bin] || 0)
        };
    });
}

function histogramaComFiltro(filtro) {
    const coluna = filtro.estatistica_macro_id ? colunaPorEstatistica(filtro.estatistica_macro_id) : 'nota_cn';
    const cond = montarCondicoesFiltro(filtro);
    const { caseExpr, orderExpr } = construirCaseFaixa(coluna);

    const anoWhere = cond.whereClause ? ajustarAliasesWhere(cond.whereClause, 'r', 'r2') : '';
    const anoQuery = cond.joinEscola ?
        `SELECT MAX(r2.ano) FROM registro r2 JOIN escola e2 ON r2.escola_id = e2.codigoEscola ${anoWhere}` :
        `SELECT MAX(r2.ano) FROM registro r2 ${anoWhere}`;

    const instrucaoSql = `
        SELECT faixa_nota AS bins, quantidade AS \`values\`
        FROM (
            SELECT ${caseExpr.replace(/\n/g, ' ')}, COUNT(*) AS quantidade
            FROM registro r
            ${cond.joinEscola ? 'JOIN escola e ON r.escola_id = e.codigoEscola' : ''}
            ${cond.whereClause ? cond.whereClause + ' AND' : 'WHERE'}
              r.ano = (${anoQuery})
              AND r.${coluna} IS NOT NULL
            GROUP BY faixa_nota
        ) AS t
        ORDER BY ${orderExpr.replace(/\n/g, ' ')};
    `;

    return database.executar(instrucaoSql);
}

function medianasComFiltro(filtro) {
    const cond = montarCondicoesFiltro(filtro);
    const subWhere = cond.whereClause ? ajustarAliasesWhere(cond.whereClause, 'r', 'r2') : '';

    const anoQuery = cond.joinEscola ?
        `SELECT MAX(r2.ano) FROM registro r2 JOIN escola e2 ON r2.escola_id = e2.codigoEscola ${subWhere}` :
        `SELECT MAX(r2.ano) FROM registro r2 ${subWhere}`;

    const instr = `
        SELECT nota_cn, nota_ch, nota_lp, nota_mt, nota_red
        FROM registro r
        ${cond.joinEscola ? 'JOIN escola e ON r.escola_id = e.codigoEscola' : ''}
        ${cond.whereClause ? cond.whereClause + ' AND' : 'WHERE'}
          r.ano = (${anoQuery})
    `;

    return database.executar(instr).then(resultado => {
        const notas_cn = resultado.map(r => parseFloat(r.nota_cn)).filter(n => !isNaN(n));
        const notas_ch = resultado.map(r => parseFloat(r.nota_ch)).filter(n => !isNaN(n));
        const notas_lp = resultado.map(r => parseFloat(r.nota_lp)).filter(n => !isNaN(n));
        const notas_mt = resultado.map(r => parseFloat(r.nota_mt)).filter(n => !isNaN(n));
        const notas_red = resultado.map(r => parseFloat(r.nota_red)).filter(n => !isNaN(n));

        return [{
            mediana_cn: calcularMediana(notas_cn),
            mediana_ch: calcularMediana(notas_ch),
            mediana_lp: calcularMediana(notas_lp),
            mediana_mt: calcularMediana(notas_mt),
            mediana_red: calcularMediana(notas_red)
        }];
    });
}

function kpisComFiltro(filtro) {
    const cond = montarCondicoesFiltro(filtro);
    const subWhere = cond.whereClause ? ajustarAliasesWhere(cond.whereClause, 'r', 'r2') : '';

    const anoQuery = cond.joinEscola ?
        `SELECT MAX(r2.ano) FROM registro r2 JOIN escola e2 ON r2.escola_id = e2.codigoEscola ${subWhere}` :
        `SELECT MAX(r2.ano) FROM registro r2 ${subWhere}`;

    const instrucaoSqlEscola = `
        SELECT nota_cn, nota_ch, nota_lp, nota_mt, nota_red
        FROM registro r
        ${cond.joinEscola ? 'JOIN escola e ON r.escola_id = e.codigoEscola' : ''}
        ${cond.whereClause ? cond.whereClause + ' AND' : 'WHERE'}
          r.ano = (${anoQuery});
    `;

    const instrucaoSqlBrasil = `
        SELECT mediana_cn, mediana_ch, mediana_lp, mediana_mt, mediana_red
        FROM estatistica_macro
        WHERE categoria = 'BRASIL'
          AND ano = (SELECT MAX(ano) FROM estatistica_macro WHERE categoria = 'BRASIL')
        LIMIT 1;
    `;

    return Promise.all([
        database.executar(instrucaoSqlEscola),
        database.executar(instrucaoSqlBrasil)
    ]).then(([resultadoEscola, resultadoBrasil]) => {
        const notas_cn = resultadoEscola.map(r => parseFloat(r.nota_cn)).filter(n => !isNaN(n));
        const notas_ch = resultadoEscola.map(r => parseFloat(r.nota_ch)).filter(n => !isNaN(n));
        const notas_lp = resultadoEscola.map(r => parseFloat(r.nota_lp)).filter(n => !isNaN(n));
        const notas_mt = resultadoEscola.map(r => parseFloat(r.nota_mt)).filter(n => !isNaN(n));
        const notas_red = resultadoEscola.map(r => parseFloat(r.nota_red)).filter(n => !isNaN(n));

        const brasil = resultadoBrasil[0] || {};

        return [{
            cn: calcularMediana(notas_cn),
            ch: calcularMediana(notas_ch),
            lp: calcularMediana(notas_lp),
            mt: calcularMediana(notas_mt),
            red: calcularMediana(notas_red),
            br_cn: brasil.mediana_cn ? parseFloat(brasil.mediana_cn) : null,
            br_ch: brasil.mediana_ch ? parseFloat(brasil.mediana_ch) : null,
            br_lp: brasil.mediana_lp ? parseFloat(brasil.mediana_lp) : null,
            br_mt: brasil.mediana_mt ? parseFloat(brasil.mediana_mt) : null,
            br_red: brasil.mediana_red ? parseFloat(brasil.mediana_red) : null
        }];
    });
}

module.exports = {
    histograma,
    medianasEscola,
    kpis,
    medianasBrasil,
    medianas,
    histogramaComFiltro,
    medianasComFiltro,
    kpisComFiltro,
    histogramaComparativo,
    colunaPorEstatistica,
    montarCondicoesFiltro,
    ajustarAliasesWhere
};