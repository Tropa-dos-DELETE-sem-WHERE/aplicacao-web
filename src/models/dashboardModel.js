var database = require("../database/config");

function histograma(idEscola) {
    console.log("");

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

// Função auxiliar para calcular mediana
function calcularMediana(valores) {
    if (valores.length === 0) return null;
    
    // Ordena os valores
    const sorted = valores.sort((a, b) => a - b);
    const meio = Math.floor(sorted.length / 2);
    
    // Se for número par de elementos, faz a média dos dois centrais
    if (sorted.length % 2 === 0) {
        return (sorted[meio - 1] + sorted[meio]) / 2;
    }
    // Se for ímpar, retorna o elemento central
    return sorted[meio];
}

async function medianasEscola(idEscola) {
    console.log("");
    
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
        ORDER BY nota_cn;
    `;

    const resultado = await database.executar(instrucaoSql);
    
    // Extrai os arrays de notas
    const notas_cn = resultado.map(r => parseFloat(r.nota_cn)).filter(n => n !== null);
    const notas_ch = resultado.map(r => parseFloat(r.nota_ch)).filter(n => n !== null);
    const notas_lp = resultado.map(r => parseFloat(r.nota_lp)).filter(n => n !== null);
    const notas_mt = resultado.map(r => parseFloat(r.nota_mt)).filter(n => n !== null);
    const notas_red = resultado.map(r => parseFloat(r.nota_red)).filter(n => n !== null);
    
    // Calcula as medianas
    return [{
        mediana_cn: calcularMediana(notas_cn),
        mediana_ch: calcularMediana(notas_ch),
        mediana_lp: calcularMediana(notas_lp),
        mediana_mt: calcularMediana(notas_mt),
        mediana_red: calcularMediana(notas_red)
    }];
}

async function kpis(idEscola) {
    console.log("");
    
    // Busca as notas da escola
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
    
    // Busca as medianas do Brasil
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

    const resultadoEscola = await database.executar(instrucaoSqlEscola);
    const resultadoBrasil = await database.executar(instrucaoSqlBrasil);
    
    // Extrai os arrays de notas
    const notas_cn = resultadoEscola.map(r => parseFloat(r.nota_cn)).filter(n => n !== null);
    const notas_ch = resultadoEscola.map(r => parseFloat(r.nota_ch)).filter(n => n !== null);
    const notas_lp = resultadoEscola.map(r => parseFloat(r.nota_lp)).filter(n => n !== null);
    const notas_mt = resultadoEscola.map(r => parseFloat(r.nota_mt)).filter(n => n !== null);
    const notas_red = resultadoEscola.map(r => parseFloat(r.nota_red)).filter(n => n !== null);
    
    // Calcula as medianas da escola
    const medianas_escola = {
        cn: calcularMediana(notas_cn),
        ch: calcularMediana(notas_ch),
        lp: calcularMediana(notas_lp),
        mt: calcularMediana(notas_mt),
        red: calcularMediana(notas_red)
    };
    
    // Pega as medianas do Brasil
    const brasil = resultadoBrasil[0];
    
    return [{
        cn: medianas_escola.cn,
        ch: medianas_escola.ch,
        lp: medianas_escola.lp,
        mt: medianas_escola.mt,
        red: medianas_escola.red,
        br_cn: parseFloat(brasil.mediana_cn),
        br_ch: parseFloat(brasil.mediana_ch),
        br_lp: parseFloat(brasil.mediana_lp),
        br_mt: parseFloat(brasil.mediana_mt),
        br_red: parseFloat(brasil.mediana_red)
    }];
}

async function medianas(idEscola) {
    console.log("");
    
    const query = `
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

    const resultado = await database.executar(query);
    
    // Extrai os arrays de notas
    const notas_cn = resultado.map(r => parseFloat(r.nota_cn)).filter(n => n !== null);
    const notas_ch = resultado.map(r => parseFloat(r.nota_ch)).filter(n => n !== null);
    const notas_lp = resultado.map(r => parseFloat(r.nota_lp)).filter(n => n !== null);
    const notas_mt = resultado.map(r => parseFloat(r.nota_mt)).filter(n => n !== null);
    const notas_red = resultado.map(r => parseFloat(r.nota_red)).filter(n => n !== null);
    
    // Calcula as medianas
    return [{
        mediana_cn: calcularMediana(notas_cn),
        mediana_ch: calcularMediana(notas_ch),
        mediana_lp: calcularMediana(notas_lp),
        mediana_mt: calcularMediana(notas_mt),
        mediana_red: calcularMediana(notas_red)
    }];
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

async function histogramaComparativo(filtro, idEscolaUsuario) {
    // coluna da matéria (padrão: nota_cn)
    const coluna = filtro.estatistica_macro_id ? colunaPorestatistica_macro(filtro.estatistica_macro_id) : 'nota_cn';

    const cond = montarCondicoesFiltro(filtro);

    // Encontra o ano mais recente dentro do conjunto filtrado
    const anoWhere = cond.whereClause ? ajustarAliasesWhere(cond.whereClause, 'r', 'r2') : '';
    const anoQuery = cond.joinEscola ?
        `SELECT MAX(r2.ano) FROM registro r2 JOIN escola e2 ON r2.escola_id = e2.codigoEscola ${anoWhere.replace(/\br2\./g, 'r2.').replace(/\be2\./g, 'e2.')}` :
        `SELECT MAX(r2.ano) FROM registro r2 ${anoWhere}`;

    // Define faixas de nota
    let caseExpr;
    let orderExpr;
    if (coluna === 'nota_red') {
        caseExpr = `
            CASE
                WHEN ${'r.'+coluna} < 400 THEN '0-400'
                WHEN ${'r.'+coluna} >= 400 AND ${'r.'+coluna} < 500 THEN '400-500'
                WHEN ${'r.'+coluna} >= 500 AND ${'r.'+coluna} < 600 THEN '500-600'
                WHEN ${'r.'+coluna} >= 600 AND ${'r.'+coluna} < 700 THEN '600-700'
                WHEN ${'r.'+coluna} >= 700 AND ${'r.'+coluna} < 800 THEN '700-800'
                WHEN ${'r.'+coluna} >= 800 AND ${'r.'+coluna} < 900 THEN '800-900'
                WHEN ${'r.'+coluna} >= 900 AND ${'r.'+coluna} < 1000 THEN '900-1000'
                WHEN ${'r.'+coluna} >= 1000 THEN '1000+'
            END AS faixa_nota
        `;
        orderExpr = `
            CASE faixa_nota
                WHEN '0-400' THEN 1
                WHEN '400-500' THEN 2
                WHEN '500-600' THEN 3
                WHEN '600-700' THEN 4
                WHEN '700-800' THEN 5
                WHEN '800-900' THEN 6
                WHEN '900-1000' THEN 7
                WHEN '1000+' THEN 8
            END
        `;
    } else {
        caseExpr = `
            CASE
                WHEN ${'r.'+coluna} < 400 THEN '0-400'
                WHEN ${'r.'+coluna} >= 400 AND ${'r.'+coluna} < 500 THEN '400-500'
                WHEN ${'r.'+coluna} >= 500 AND ${'r.'+coluna} < 600 THEN '500-600'
                WHEN ${'r.'+coluna} >= 600 AND ${'r.'+coluna} < 700 THEN '600-700'
                WHEN ${'r.'+coluna} >= 700 THEN '700+'
            END AS faixa_nota
        `;
        orderExpr = `
            CASE faixa_nota
                WHEN '0-400' THEN 1
                WHEN '400-500' THEN 2
                WHEN '500-600' THEN 3
                WHEN '600-700' THEN 4
                WHEN '700+' THEN 5
            END
        `;
    }

    // Query para o filtro
    const sqlFiltro = `
        SELECT
            faixa_nota AS bins,
            quantidade AS ` + "`values`" + `
        FROM (
            SELECT
                ${caseExpr},
                COUNT(*) AS quantidade
            FROM registro r
            ${cond.joinEscola ? 'JOIN escola e ON r.escola_id = e.codigoEscola' : ''}
            ${cond.whereClause ? cond.whereClause + ' AND' : 'WHERE'}
              r.ano = (${anoQuery})
              AND ${'r.'+coluna} IS NOT NULL
            GROUP BY faixa_nota
        ) AS t
        ORDER BY
            ${orderExpr};
    `;

    // Query para a escola do usuário (sempre Ciências da Natureza ou a matéria selecionada)
    const sqlEscola = `
        SELECT
            faixa_nota AS bins,
            quantidade AS ` + "`values`" + `
        FROM (
            SELECT
                ${caseExpr},
                COUNT(*) AS quantidade
            FROM registro r
            WHERE r.escola_id = ${idEscolaUsuario}
              AND r.ano = (SELECT MAX(ano) FROM registro WHERE escola_id = ${idEscolaUsuario})
              AND ${'r.'+coluna} IS NOT NULL
            GROUP BY faixa_nota
        ) AS t
        ORDER BY
            ${orderExpr};
    `;

    const resultadoFiltro = await database.executar(sqlFiltro);
    const resultadoEscola = await database.executar(sqlEscola);

    // Monta bins padrão para normalizar dados
    let binsDefault = ['0-400', '400-500', '500-600', '600-700', '700+'];
    if (coluna === 'nota_red') {
        binsDefault = ['0-400', '400-500', '500-600', '600-700', '700-800', '800-900', '900-1000', '1000+'];
    }

    // Normaliza resultados
    const mapFiltro = {};
    const mapEscola = {};
    resultadoFiltro.forEach(row => {
        mapFiltro[row.bins] = parseInt(row.values, 10);
    });
    resultadoEscola.forEach(row => {
        mapEscola[row.bins] = parseInt(row.values, 10);
    });

    const valuesFiltro = binsDefault.map(bin => mapFiltro[bin] || 0);
    const valuesEscola = binsDefault.map(bin => mapEscola[bin] || 0);

    return {
        bins: binsDefault,
        dataFiltro: valuesFiltro,
        dataEscola: valuesEscola
    };
}

// Helper: map estatistica_macro_id to registro column
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

// Constrói cláusula JOIN/WHERE para filtros de escola/tipo/UF
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

    return { whereClause: where.length ? 'WHERE ' + where.join(' AND ') : '', joinEscola };
}

// Replace table aliases in a WHERE clause for use inside subqueries (e.g. r -> r2, e -> e2)
function ajustarAliasesWhere(whereClause, fromAlias, toAlias) {
    if (!whereClause) return '';
    // replace occurrences like 'r.' and 'e.' with new aliases
    return whereClause.replace(new RegExp(`\\b${fromAlias}\\.`, 'g'), `${toAlias}.`);
}

async function histogramaComFiltro(filtro) {
    // subject column
    const coluna = filtro.estatistica_macro_id ? colunaPorestatistica_macro(filtro.estatistica_macro_id) : 'nota_cn';

    const cond = montarCondicoesFiltro(filtro);

    // Encontrar o ano mais recente dentro do conjunto filtrado
    // build anoQuery replacing aliases appropriately for the subquery
    const anoWhere = cond.whereClause ? ajustarAliasesWhere(cond.whereClause, 'r', 'r2') : '';
    const anoWhereJoin = cond.whereClause ? ajustarAliasesWhere(cond.whereClause, 'e', 'e2') : '';
    const anoQuery = cond.joinEscola ?
        `SELECT MAX(r2.ano) FROM registro r2 JOIN escola e2 ON r2.escola_id = e2.codigoEscola ${anoWhere.replace(/\br2\./g, 'r2.').replace(/\be2\./g, 'e2.')}` :
        `SELECT MAX(r2.ano) FROM registro r2 ${anoWhere}`;

    // Build CASE expression and order mapping – use finer bins for redação
    let caseExpr;
    let orderExpr;
    if (coluna === 'nota_red') {
        caseExpr = `
                CASE
                    WHEN ${'r.'+coluna} < 400 THEN '0-400'
                    WHEN ${'r.'+coluna} >= 400 AND ${'r.'+coluna} < 500 THEN '400-500'
                    WHEN ${'r.'+coluna} >= 500 AND ${'r.'+coluna} < 600 THEN '500-600'
                    WHEN ${'r.'+coluna} >= 600 AND ${'r.'+coluna} < 700 THEN '600-700'
                    WHEN ${'r.'+coluna} >= 700 AND ${'r.'+coluna} < 800 THEN '700-800'
                    WHEN ${'r.'+coluna} >= 800 AND ${'r.'+coluna} < 900 THEN '800-900'
                    WHEN ${'r.'+coluna} >= 900 AND ${'r.'+coluna} < 1000 THEN '900-1000'
                    WHEN ${'r.'+coluna} >= 1000 THEN '1000+'
                END AS faixa_nota,
        `;
        orderExpr = `
            CASE faixa_nota
                WHEN '0-400' THEN 1
                WHEN '400-500' THEN 2
                WHEN '500-600' THEN 3
                WHEN '600-700' THEN 4
                WHEN '700-800' THEN 5
                WHEN '800-900' THEN 6
                WHEN '900-1000' THEN 7
                WHEN '1000+' THEN 8
            END
        `;
    } else {
        caseExpr = `
                CASE
                    WHEN ${'r.'+coluna} < 400 THEN '0-400'
                    WHEN ${'r.'+coluna} >= 400 AND ${'r.'+coluna} < 500 THEN '400-500'
                    WHEN ${'r.'+coluna} >= 500 AND ${'r.'+coluna} < 600 THEN '500-600'
                    WHEN ${'r.'+coluna} >= 600 AND ${'r.'+coluna} < 700 THEN '600-700'
                    WHEN ${'r.'+coluna} >= 700 THEN '700+'
                END AS faixa_nota,
        `;
        orderExpr = `
            CASE faixa_nota
                WHEN '0-400' THEN 1
                WHEN '400-500' THEN 2
                WHEN '500-600' THEN 3
                WHEN '600-700' THEN 4
                WHEN '700+' THEN 5
            END
        `;
    }

    const instrucaoSql = `
        SELECT
            faixa_nota AS bins,
            quantidade AS ` + "`values`" + `
        FROM (
            SELECT
                ${caseExpr}
                COUNT(*) AS quantidade
            FROM registro r
            ${cond.joinEscola ? 'JOIN escola e ON r.escola_id = e.codigoEscola' : ''}
            ${cond.whereClause ? cond.whereClause + ' AND' : 'WHERE'}
              r.ano = (${anoQuery})
              AND ${'r.'+coluna} IS NOT NULL
            GROUP BY faixa_nota
        ) AS t
        ORDER BY
            ${orderExpr};
    `;

    return database.executar(instrucaoSql);
}

async function medianasComFiltro(filtro) {
    const cond = montarCondicoesFiltro(filtro);
    // prepare where for subquery (use r2/e2 aliases)
    const subWhere = cond.whereClause ? ajustarAliasesWhere(cond.whereClause, 'r', 'r2') : '';
    const subWhereJoin = cond.whereClause ? ajustarAliasesWhere(cond.whereClause, 'e', 'e2') : '';

    const instr = `
        SELECT
            nota_cn,
            nota_ch,
            nota_lp,
            nota_mt,
            nota_red
        FROM registro r
        ${cond.joinEscola ? 'JOIN escola e ON r.escola_id = e.codigoEscola' : ''}
        ${cond.whereClause ? cond.whereClause + ' AND' : 'WHERE'}
          r.ano = (SELECT MAX(r2.ano) FROM registro r2 ${cond.joinEscola ? 'JOIN escola e2 ON r2.escola_id = e2.codigoEscola' : ''} ${subWhere})
    `;

    const resultado = await database.executar(instr);

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
}

async function kpisComFiltro(filtro) {
    const cond = montarCondicoesFiltro(filtro);

    // prepare subquery where for kpis
    const subWhereKpis = cond.whereClause ? ajustarAliasesWhere(cond.whereClause, 'r', 'r2') : '';

    const instrucaoSqlEscola = `
        SELECT
            nota_cn,
            nota_ch,
            nota_lp,
            nota_mt,
            nota_red
        FROM registro r
        ${cond.joinEscola ? 'JOIN escola e ON r.escola_id = e.codigoEscola' : ''}
        ${cond.whereClause ? cond.whereClause + ' AND' : 'WHERE'}
          r.ano = (SELECT MAX(r2.ano) FROM registro r2 ${cond.joinEscola ? 'JOIN escola e2 ON r2.escola_id = e2.codigoEscola' : ''} ${subWhereKpis});
    `;

    const instrucaoSqlBrasil = `
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

    const resultadoEscola = await database.executar(instrucaoSqlEscola);
    const resultadoBrasil = await database.executar(instrucaoSqlBrasil);

    const notas_cn = resultadoEscola.map(r => parseFloat(r.nota_cn)).filter(n => !isNaN(n));
    const notas_ch = resultadoEscola.map(r => parseFloat(r.nota_ch)).filter(n => !isNaN(n));
    const notas_lp = resultadoEscola.map(r => parseFloat(r.nota_lp)).filter(n => !isNaN(n));
    const notas_mt = resultadoEscola.map(r => parseFloat(r.nota_mt)).filter(n => !isNaN(n));
    const notas_red = resultadoEscola.map(r => parseFloat(r.nota_red)).filter(n => !isNaN(n));

    const medianas_escola = {
        cn: calcularMediana(notas_cn),
        ch: calcularMediana(notas_ch),
        lp: calcularMediana(notas_lp),
        mt: calcularMediana(notas_mt),
        red: calcularMediana(notas_red)
    };

    const brasil = resultadoBrasil[0] || {};

    return [{
        cn: medianas_escola.cn,
        ch: medianas_escola.ch,
        lp: medianas_escola.lp,
        mt: medianas_escola.mt,
        red: medianas_escola.red,
        br_cn: brasil.mediana_cn ? parseFloat(brasil.mediana_cn) : null,
        br_ch: brasil.mediana_ch ? parseFloat(brasil.mediana_ch) : null,
        br_lp: brasil.mediana_lp ? parseFloat(brasil.mediana_lp) : null,
        br_mt: brasil.mediana_mt ? parseFloat(brasil.mediana_mt) : null,
        br_red: brasil.mediana_red ? parseFloat(brasil.mediana_red) : null
    }];
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
}