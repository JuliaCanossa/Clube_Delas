create database if not exists clube_delas;
use clube_delas;

-- tabela 1: usuario
-- guarda quem usa o app
create table usuario (
id_usuario int auto_increment primary key,
nome varchar(100) not null,
email varchar(100) not null unique,
senha_hash varchar(255) not null,
data_cadastro date default (current_date)
);

-- tabela 2: habito
-- cada hábito pertence a uma usuária
create table habito (
id_habito int auto_increment primary key,
nome varchar(100) not null,
descricao varchar(200),
categoria varchar(50),
fk_usuario int not null,
foreign key (fk_usuario) references usuario(id_usuario) on delete cascade
);

-- tabela 3: registro_execucao
-- cada linha = "fiz (ou não) esse hábito nesse dia"
create table registro_execucao (
id_registro_execucao int auto_increment primary key,
fk_habito int not null,
data_execucao date not null,
concluido boolean not null default 0,
notas varchar(255),
foreign key (fk_habito) references habito(id_habito) on delete cascade,
unique (fk_habito, data_execucao)
);


