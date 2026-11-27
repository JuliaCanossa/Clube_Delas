-- clube delas: script com 3 tabelas (usuario, habito, registro_execucao)
-- cria o banco de dados e já seleciona ele pra usar
create database if not exists clube_delas;
use clube_delas;

-- tabela 1: usuario
-- guarda quem usa o app
create table usuario (
-- id é o número único de cada usuária, o banco gera sozinho (1, 2, 3...)
id_usuario int auto_increment primary key,
nome varchar(100) not null,
-- unique = não pode ter dois cadastros com o mesmo email
email varchar(100) not null unique,
-- nunca guardar a senha pura, só o hash (senha embaralhada)
senha_hash varchar(255) not null,
-- se não informar a data, o banco coloca o dia de hoje
data_cadastro date default (current_date)
);

-- tabela 2: habito
-- cada hábito pertence a uma usuária
create table habito (
id_habito int auto_increment primary key,
nome varchar(100) not null,
descricao varchar(200),
-- a categoria virou uma coluna aqui dentro (ex: saude, estudos, bem-estar)
categoria varchar(50),
-- fk_usuario liga o hábito à dona dele (relação 1 usuária : N hábitos)
fk_usuario int not null,
-- diz ao banco que fk_usuario só pode ter um id que exista em usuario
-- on delete cascade = se apagar a usuária, apaga os hábitos dela também
foreign key (fk_usuario) references usuario(id_usuario) on delete cascade
);

-- tabela 3: registro_execucao
-- cada linha = "fiz (ou não) esse hábito nesse dia"
create table registro_execucao (
id_registro_execucao int auto_increment primary key,
-- fk_habito liga o registro ao hábito (relação 1 hábito : N registros)
fk_habito int not null,
data_execucao date not null,
-- boolean: 1 = concluído, 0 = não concluído
concluido boolean not null default 0,
notas varchar(255),
foreign key (fk_habito) references habito(id_habito) on delete cascade,
-- impede dois registros do mesmo hábito no mesmo dia
unique (fk_habito, data_execucao)
);


