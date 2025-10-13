CREATE DATABASE IF NOT EXISTS educadata;
USE educadata;

-- -----------------------------------------------------
-- Tabela Tipo de Escola
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS tipoEscola (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(45) NOT NULL
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela UF
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS UF (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uf CHAR(2) NOT NULL
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela Escola
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS escola (
  id INT AUTO_INCREMENT PRIMARY KEY,
	nomeEscola VARCHAR(100) NOT NULL,
  codigoEscola VARCHAR(45) NOT NULL,
  tipoEscola_id INT NOT NULL,
  UF_id INT NOT NULL,
  FOREIGN KEY (tipoEscola_id) REFERENCES tipoEscola(id),
  FOREIGN KEY (UF_id) REFERENCES UF(id)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela Tipo de Usuário
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS tipoUsuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(45) NOT NULL
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela Usuário
-- -----------------------------------------------------
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

-- -----------------------------------------------------
-- Tabela Meta
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS meta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela chave-valor para Meta
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS metaAtributo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  meta_id INT NOT NULL,
  chave VARCHAR(45) NOT NULL,
  valor VARCHAR(255) NOT NULL,
  FOREIGN KEY (meta_id) REFERENCES meta(id)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela Filtro
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS filtro (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipoEscola_id INT NOT NULL,
  UF_id INT NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuario(id),
  FOREIGN KEY (tipoEscola_id) REFERENCES tipoEscola(id),
  FOREIGN KEY (UF_id) REFERENCES UF(id)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela Logs
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  dataLog DATETIME NOT NULL,
  tipo VARCHAR(45) NOT NULL
) ENGINE = InnoDB;


INSERT INTO tipoEscola (tipo) VALUES
('Municipal'),
('Estadual'),
('Federal'),
('Privadas');

INSERT INTO UF (uf) VALUES 
('AC'), -- Acre
('AL'), -- Alagoas
('AP'), -- Amapá
('AM'), -- Amazonas
('BA'), -- Bahia
('CE'), -- Ceará
('ES'), -- Espírito Santo
('GO'), -- Goiás
('MA'), -- Maranhão
('MT'), -- Mato Grosso
('MS'), -- Mato Grosso do Sul
('MG'), -- Minas Gerais
('PA'), -- Pará
('PB'), -- Paraíba
('PR'), -- Paraná
('PE'), -- Pernambuco
('PI'), -- Piauí
('RJ'), -- Rio de Janeiro
('RN'), -- Rio Grande do Norte
('RS'), -- Rio Grande do Sul
('RO'), -- Rondônia
('RR'), -- Roraima
('SC'), -- Santa Catarina
('SP'), -- São Paulo
('SE'), -- Sergipe
('TO'); -- Tocantins


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
  (SELECT id FROM escola WHERE nomeEscola = 'ESC COLEGIO CRISTAO CRUZEIRO')
);
