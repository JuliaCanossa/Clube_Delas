CREATE DATABASE  clubedelas;

USE clube_delas;

-- usuárias do Clube Delas (login e cadastro)
CREATE TABLE usuario (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL UNIQUE,   -- não permite dois cadastros com o mesmo e-mail
	senha VARCHAR(50) NOT NULL
);

-- hábitos que cada usuária cadastra no checklist
CREATE TABLE habitos (
	idHabito INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(100) NOT NULL,
	fkUsuario INT NOT NULL,
	FOREIGN KEY (fkUsuario) REFERENCES usuario(id)
		ON DELETE CASCADE                -- apagou a usuária, apaga os hábitos dela
);

-- cada check marcado vira uma linha com a data (o dashboard conta daqui)
CREATE TABLE checklist (
	idChecklist INT PRIMARY KEY AUTO_INCREMENT,
	fkHabito INT NOT NULL,
	dataCheck DATE NOT NULL,
	FOREIGN KEY (fkHabito) REFERENCES habitos(idHabito)
		ON DELETE CASCADE,               -- apagou o hábito, apaga os checks dele
	UNIQUE (fkHabito, dataCheck)         -- só 1 check por hábito por dia
);

-- dados de teste (opcional): servem para ver o dashboard preenchido
INSERT INTO usuario (nome, email, senha) VALUES ('Teste', 'teste@email.com', '123456');

INSERT INTO habitos (nome, fkUsuario) VALUES ('Beber água', 1);
INSERT INTO habitos (nome, fkUsuario) VALUES ('Ler 10 minutos', 1);
INSERT INTO habitos (nome, fkUsuario) VALUES ('Exercício', 1);
INSERT INTO habitos (nome, fkUsuario) VALUES ('Dormir cedo', 1);
INSERT INTO habitos (nome, fkUsuario) VALUES ('Meditar', 1);

INSERT INTO checklist (fkHabito, dataCheck) VALUES (1, CURDATE());
INSERT INTO checklist (fkHabito, dataCheck) VALUES (1, CURDATE() - INTERVAL 1 DAY);
INSERT INTO checklist (fkHabito, dataCheck) VALUES (2, CURDATE());
INSERT INTO checklist (fkHabito, dataCheck) VALUES (3, CURDATE() - INTERVAL 2 DAY);

-- conferência
SELECT * FROM usuario;
SELECT * FROM habitos;
SELECT * FROM checklist;