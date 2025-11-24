CREATE DATABASE IF NOT EXISTS educadata;
USE educadata;


CREATE TABLE IF NOT EXISTS tipoEscola (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('Estadual','Municipal','Federal') NOT NULL
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS UF (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uf CHAR(2) NOT NULL
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS escola (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nomeEscola VARCHAR(100) NOT NULL,
  codigoEscola VARCHAR(45) NOT NULL,
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
  FOREIGN KEY (escola_id) REFERENCES escola(id),
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

CREATE TABLE IF NOT EXISTS materia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS filtro (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(30) NOT NULL,
  emUso ENUM('sim','nao'),
  usuario_id INT NOT NULL,
  tipoEscola_id INT NOT NULL,
  materia_id INT NOT NULL,
  UF_id INT NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id),
  FOREIGN KEY (tipoEscola_id) REFERENCES tipoEscola(id),
  FOREIGN KEY (materia_id) REFERENCES materia(id),
  FOREIGN KEY (UF_id) REFERENCES UF(id)
) ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS slack (
  idslack INT AUTO_INCREMENT PRIMARY KEY,
  ligar_desligar ENUM('ligar', 'desligar') NOT NULL,
  canal VARCHAR(45) NOT NULL,
  mensagem VARCHAR(255) NOT NULL,
  escola_id INT NOT NULL,
  FOREIGN KEY (escola_id) REFERENCES escola(id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS tipoLog (
  idtipoLog INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('erro', 'sucesso','aviso') NOT NULL
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  dataLog DATETIME NOT NULL,
  tipoLog_id INT NOT NULL,
  FOREIGN KEY (tipoLog_id) REFERENCES tipoLog(idtipoLog)
) ENGINE = InnoDB;


INSERT INTO materia (nome) VALUES
('Ciências da Natureza'),
('Ciências Humanas'),
('Linguagens e Códigos'),
('Matemática'),
('Redação');

INSERT INTO tipoEscola (tipo) VALUES ('Estadual');
INSERT INTO tipoEscola (tipo) VALUES ('Municipal');
INSERT INTO tipoEscola (tipo) VALUES ('Federal');

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
  (SELECT id FROM tipoEscola WHERE tipo = 'Estadual'),
  (SELECT id FROM UF WHERE uf = 'AC')
);

INSERT INTO tipoLog (tipo) VALUES ('erro');
INSERT INTO tipoLog (tipo) VALUES ('sucesso');
INSERT INTO tipoLog (tipo) VALUES ('aviso');


CREATE TABLE IF NOT EXISTS registro  (
    idregistro int primary key auto_increment,
    ano int,
    codigo_uf_escola varchar(10),
    codigo_municipio_escola varchar(10),
    codigo_escola_educacenso varchar(20),
    nome_escola_educacenso varchar(100),
    taxa_participacao decimal(5,2),
    media_cn decimal(5,2),
    media_ch decimal(5,2),
    media_lp decimal(5,2),
    media_mt decimal(5,2),
    media_red decimal(5,2),
    media_obj decimal(5,2),
    media_tot decimal(5,2),
	escola_id INT NOT NULL,
  FOREIGN KEY (escola_id) REFERENCES escola(id)
);