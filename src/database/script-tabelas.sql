CREATE DATABASE IF NOT EXISTS educadata;
USE educadata;

CREATE TABLE IF NOT EXISTS tipoEscola (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('Estadual','Municipal','Federal', 'Privada') NOT NULL
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS UF (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uf CHAR(2) NOT NULL
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS escola (
  codigoEscola INT PRIMARY KEY,
  nomeEscola VARCHAR(100) NOT NULL,
  tipoEscola_id INT NOT NULL,
  UF_id INT NOT NULL,
  FOREIGN KEY (tipoEscola_id) REFERENCES tipoEscola(id),
  FOREIGN KEY (UF_id) REFERENCES UF(id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS tipoUsuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(45) NOT NULL
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  escola_id INT NOT NULL,
  tipoUsuario_id INT NOT NULL,
  FOREIGN KEY (escola_id) REFERENCES escola(codigoEscola),
  FOREIGN KEY (tipoUsuario_id) REFERENCES tipoUsuario(id)
) ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS meta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tituloMeta VARCHAR(45) NOT NULL,
  descMeta VARCHAR(255) NOT NULL,
  dataExpiracao DATE NOT NULL,
  usuario_id INT NOT NULL,
  statusMeta ENUM("abertas", "concluidas","expiradas"),
  FOREIGN KEY (usuario_id) REFERENCES usuario(id)
) ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS filtro (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipoEscola_id INT NOT NULL,
  UF_id INT NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id),
  FOREIGN KEY (tipoEscola_id) REFERENCES tipoEscola(id),
  FOREIGN KEY (UF_id) REFERENCES UF(id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS slack (
  idslack INT AUTO_INCREMENT PRIMARY KEY,
  ligar_desligar ENUM('ligar', 'desligar') NOT NULL,
  canal VARCHAR(45) NOT NULL,
  mensagem VARCHAR(255) NOT NULL,
  escola_id INT NOT NULL,
  FOREIGN KEY (escola_id) REFERENCES escola(codigoEscola)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS tipoLog (
  idtipoLog INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('erro', 'sucesso','aviso') NOT NULL
) ENGINE = InnoDB;
select * from tipoLog;
CREATE TABLE IF NOT EXISTS logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  dataLog DATETIME NOT NULL,
  tipoLog_id INT NOT NULL,
  FOREIGN KEY (tipoLog_id) REFERENCES tipoLog(idtipoLog)
) ENGINE = InnoDB;

INSERT INTO tipoEscola (tipo) VALUES ('Estadual');
INSERT INTO tipoEscola (tipo) VALUES ('Municipal');
INSERT INTO tipoEscola (tipo) VALUES ('Federal');
INSERT INTO tipoEscola (tipo) VALUES ('Privada');

INSERT INTO UF (id, uf) VALUES (11, 'RO'); -- Rondônia
INSERT INTO UF (id, uf) VALUES (12, 'AC'); -- Acre
INSERT INTO UF (id, uf) VALUES (13, 'AM'); -- Amazonas
INSERT INTO UF (id, uf) VALUES (14, 'RR'); -- Roraima
INSERT INTO UF (id, uf) VALUES (15, 'PA'); -- Pará
INSERT INTO UF (id, uf) VALUES (16, 'AP'); -- Amapá
INSERT INTO UF (id, uf) VALUES (17, 'TO'); -- Tocantins
INSERT INTO UF (id, uf) VALUES (21, 'MA'); -- Maranhão
INSERT INTO UF (id, uf) VALUES (22, 'PI'); -- Piauí
INSERT INTO UF (id, uf) VALUES (23, 'CE'); -- Ceará
INSERT INTO UF (id, uf) VALUES (24, 'RN'); -- Rio Grande do Norte
INSERT INTO UF (id, uf) VALUES (25, 'PB'); -- Paraíba
INSERT INTO UF (id, uf) VALUES (26, 'PE'); -- Pernambuco
INSERT INTO UF (id, uf) VALUES (27, 'AL'); -- Alagoas
INSERT INTO UF (id, uf) VALUES (28, 'SE'); -- Sergipe
INSERT INTO UF (id, uf) VALUES (29, 'BA'); -- Bahia
INSERT INTO UF (id, uf) VALUES (31, 'MG'); -- Minas Gerais
INSERT INTO UF (id, uf) VALUES (32, 'ES'); -- Espírito Santo
INSERT INTO UF (id, uf) VALUES (33, 'RJ'); -- Rio de Janeiro
INSERT INTO UF (id, uf) VALUES (35, 'SP'); -- São Paulo
INSERT INTO UF (id, uf) VALUES (41, 'PR'); -- Paraná
INSERT INTO UF (id, uf) VALUES (42, 'SC'); -- Santa Catarina
INSERT INTO UF (id, uf) VALUES (43, 'RS'); -- Rio Grande do Sul
INSERT INTO UF (id, uf) VALUES (50, 'MS'); -- Mato Grosso do Sul
INSERT INTO UF (id, uf) VALUES (51, 'MT'); -- Mato Grosso
INSERT INTO UF (id, uf) VALUES (52, 'GO'); -- Goiás
INSERT INTO UF (id, uf) VALUES (53, 'DF'); -- Distrito Federal


INSERT INTO tipoUsuario (tipo) VALUES 
('gestor'),
('professor'),
('aluno');

INSERT INTO escola (nomeEscola,codigoEscola, tipoEscola_id, UF_id)
VALUES (
  'ESC COLEGIO CRISTAO CRUZEIRO',
  '12000094',
  (SELECT id FROM tipoEscola WHERE tipo = 'estadual'),
  (SELECT id FROM UF WHERE uf = 'AC')
);

INSERT INTO tipoLog (tipo) VALUES ('erro');
INSERT INTO tipoLog (tipo) VALUES ('sucesso');
INSERT INTO tipoLog (tipo) VALUES ('aviso');


CREATE TABLE IF NOT EXISTS registro  (
    idregistro int primary key auto_increment,
    ano int,
    nota_cn decimal(6,2),
    nota_ch decimal(6,2),
    nota_lp decimal(6,2),
    nota_mt decimal(6,2),
    nota_red decimal(6,2),
	escola_id INT NOT NULL,
  FOREIGN KEY (escola_id) REFERENCES escola(codigoEscola)
);

CREATE TABLE IF NOT EXISTS estatistica_macro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ano INT NOT NULL,
    categoria VARCHAR(20) NOT NULL, -- Categoria: 'BRASIL', 'FEDERAL', 'ESTADUAL', 'MUNICIPAL', 'PRIVADA'
    mediana_cn DECIMAL(6,2),
    mediana_ch DECIMAL(6,2),
    mediana_lp DECIMAL(6,2),
    mediana_mt DECIMAL(6,2),
    mediana_red DECIMAL(6,2),
    UNIQUE KEY unique_ano_categoria (ano, categoria)
);
select * from logs;
select * from estatistica_macro;
select * from registro;
CREATE DATABASE IF NOT EXISTS educadata;
USE educadata;

CREATE TABLE IF NOT EXISTS tipoEscola (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('Estadual','Municipal','Federal', 'Privada') NOT NULL
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS UF (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uf CHAR(2) NOT NULL
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS escola (
  codigoEscola INT PRIMARY KEY,
  nomeEscola VARCHAR(100) NOT NULL,
  tipoEscola_id INT NOT NULL,
  UF_id INT NOT NULL,
  FOREIGN KEY (tipoEscola_id) REFERENCES tipoEscola(id),
  FOREIGN KEY (UF_id) REFERENCES UF(id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS tipoUsuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(45) NOT NULL
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  escola_id INT NOT NULL,
  tipoUsuario_id INT NOT NULL,
  FOREIGN KEY (escola_id) REFERENCES escola(codigoEscola),
  FOREIGN KEY (tipoUsuario_id) REFERENCES tipoUsuario(id)
) ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS meta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tituloMeta VARCHAR(45) NOT NULL,
  descMeta VARCHAR(255) NOT NULL,
  dataExpiracao DATE NOT NULL,
  usuario_id INT NOT NULL,
  statusMeta ENUM("abertas", "concluidas","expiradas"),
  FOREIGN KEY (usuario_id) REFERENCES usuario(id)
) ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS filtro (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipoEscola_id INT NOT NULL,
  UF_id INT NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id),
  FOREIGN KEY (tipoEscola_id) REFERENCES tipoEscola(id),
  FOREIGN KEY (UF_id) REFERENCES UF(id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS slack (
  idslack INT AUTO_INCREMENT PRIMARY KEY,
  ligar_desligar ENUM('ligar', 'desligar') NOT NULL,
  canal VARCHAR(45) NOT NULL,
  mensagem VARCHAR(255) NOT NULL,
  escola_id INT NOT NULL,
  FOREIGN KEY (escola_id) REFERENCES escola(codigoEscola)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS tipoLog (
  idtipoLog INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('erro', 'sucesso','aviso') NOT NULL
) ENGINE = InnoDB;
select * from tipoLog;
CREATE TABLE IF NOT EXISTS logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  dataLog DATETIME NOT NULL,
  tipoLog_id INT NOT NULL,
  FOREIGN KEY (tipoLog_id) REFERENCES tipoLog(idtipoLog)
) ENGINE = InnoDB;

INSERT INTO tipoEscola (tipo) VALUES ('Estadual');
INSERT INTO tipoEscola (tipo) VALUES ('Municipal');
INSERT INTO tipoEscola (tipo) VALUES ('Federal');
INSERT INTO tipoEscola (tipo) VALUES ('Privada');

INSERT INTO UF (id, uf) VALUES (11, 'RO'); -- Rondônia
INSERT INTO UF (id, uf) VALUES (12, 'AC'); -- Acre
INSERT INTO UF (id, uf) VALUES (13, 'AM'); -- Amazonas
INSERT INTO UF (id, uf) VALUES (14, 'RR'); -- Roraima
INSERT INTO UF (id, uf) VALUES (15, 'PA'); -- Pará
INSERT INTO UF (id, uf) VALUES (16, 'AP'); -- Amapá
INSERT INTO UF (id, uf) VALUES (17, 'TO'); -- Tocantins
INSERT INTO UF (id, uf) VALUES (21, 'MA'); -- Maranhão
INSERT INTO UF (id, uf) VALUES (22, 'PI'); -- Piauí
INSERT INTO UF (id, uf) VALUES (23, 'CE'); -- Ceará
INSERT INTO UF (id, uf) VALUES (24, 'RN'); -- Rio Grande do Norte
INSERT INTO UF (id, uf) VALUES (25, 'PB'); -- Paraíba
INSERT INTO UF (id, uf) VALUES (26, 'PE'); -- Pernambuco
INSERT INTO UF (id, uf) VALUES (27, 'AL'); -- Alagoas
INSERT INTO UF (id, uf) VALUES (28, 'SE'); -- Sergipe
INSERT INTO UF (id, uf) VALUES (29, 'BA'); -- Bahia
INSERT INTO UF (id, uf) VALUES (31, 'MG'); -- Minas Gerais
INSERT INTO UF (id, uf) VALUES (32, 'ES'); -- Espírito Santo
INSERT INTO UF (id, uf) VALUES (33, 'RJ'); -- Rio de Janeiro
INSERT INTO UF (id, uf) VALUES (35, 'SP'); -- São Paulo
INSERT INTO UF (id, uf) VALUES (41, 'PR'); -- Paraná
INSERT INTO UF (id, uf) VALUES (42, 'SC'); -- Santa Catarina
INSERT INTO UF (id, uf) VALUES (43, 'RS'); -- Rio Grande do Sul
INSERT INTO UF (id, uf) VALUES (50, 'MS'); -- Mato Grosso do Sul
INSERT INTO UF (id, uf) VALUES (51, 'MT'); -- Mato Grosso
INSERT INTO UF (id, uf) VALUES (52, 'GO'); -- Goiás
INSERT INTO UF (id, uf) VALUES (53, 'DF'); -- Distrito Federal


INSERT INTO tipoUsuario (tipo) VALUES 
('gestor'),
('professor'),
('aluno');

INSERT INTO escola (nomeEscola,codigoEscola, tipoEscola_id, UF_id)
VALUES ('ESC COLEGIO CRISTAO CRUZEIRO', '12000094', (SELECT id FROM tipoEscola WHERE tipo = 'estadual'), (SELECT id FROM UF WHERE uf = 'AC'));

INSERT INTO tipoLog (tipo) VALUES ('erro');
INSERT INTO tipoLog (tipo) VALUES ('sucesso');
INSERT INTO tipoLog (tipo) VALUES ('aviso');


CREATE TABLE IF NOT EXISTS registro  (
    idregistro int primary key auto_increment,
    ano int,
    nota_cn decimal(6,2),
    nota_ch decimal(6,2),
    nota_lp decimal(6,2),
    nota_mt decimal(6,2),
    nota_red decimal(6,2),
	escola_id INT NOT NULL,
  FOREIGN KEY (escola_id) REFERENCES escola(codigoEscola)
);

CREATE TABLE IF NOT EXISTS estatistica_macro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ano INT NOT NULL,
    categoria VARCHAR(20) NOT NULL, -- Categoria: 'BRASIL', 'FEDERAL', 'ESTADUAL', 'MUNICIPAL', 'PRIVADA'
    mediana_cn DECIMAL(6,2),
    mediana_ch DECIMAL(6,2),
    mediana_lp DECIMAL(6,2),
    mediana_mt DECIMAL(6,2),
    mediana_red DECIMAL(6,2),
    UNIQUE KEY unique_ano_categoria (ano, categoria)
);
select * from logs;
select * from estatistica_macro;
select * from registro;

INSERT INTO usuario (nome, email, senha, escola_id, tipoUsuario_id)
VALUES ('Gestor Teste', 'gestor@teste.com', '123456', 12000094, 1);

INSERT INTO registro (ano, nota_cn, nota_ch, nota_lp, nota_mt, nota_red, escola_id) VALUES
(2023, 350.20, 410.10, 380.50, 370.00, 600.00, 12000094), -- faixa 0-400
(2023, 420.50, 450.20, 430.00, 410.80, 580.10, 12000094), -- faixa 400-500
(2023, 480.90, 470.35, 490.00, 460.00, 620.50, 12000094), -- faixa 400-500
(2023, 520.30, 510.80, 530.00, 550.40, 650.00, 12000094), -- faixa 500-600
(2023, 580.40, 590.10, 585.00, 570.00, 680.00, 12000094), -- faixa 500-600
(2023, 620.70, 600.00, 610.00, 630.00, 700.00, 12000094), -- faixa 600-700
(2023, 680.10, 620.00, 655.00, 690.00, 710.00, 12000094), -- faixa 600-700
(2023, 720.90, 710.50, 730.00, 740.00, 800.00, 12000094);  -- faixa 700+

INSERT INTO logs (descricao, dataLog, tipoLog_id)
VALUES 
('Sistema iniciado com sucesso', NOW(), 2),
('Falha ao carregar arquivo', NOW(), 1),
('Aviso: conexão lenta detectada', NOW(), 3);

SELECT 
    faixa_nota AS bins,
    quantidade AS `values`
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
    WHERE escola_id = 12000094
      AND ano = (SELECT MAX(ano) FROM registro WHERE escola_id = 12000094)
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

select * from escola;

