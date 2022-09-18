create database Implementación;
use Implementación;

create table Usuarios(
ID_Usuarios int not null auto_increment,
Usuario varchar (50) not null,
Pass varchar (50) not null,
constraint pk_Usuarios primary key (ID_Usuarios)
);

create table RegistroFijo(
CodProfile varchar(50) not null,
VelMperMin int not null,
DynasMat int not null,
DryBetweenCol int not null,
InkSupplier varchar(50),
InkName varchar(50),
AniloxSupplier varchar(50),
TapeSupplier varchar(50),
constraint pk_RegistroFijo primary key (CodProfile)
);

create table RegistroVariable(
CodProfile varchar(50) not null,
InkColor varchar(50) not null,
Sequence int not null,
Visc int not null,
Dry int not null,
AniloxLPI int not null,
AniloxBCM int not null,
TapeCode varchar(50),
Notes varchar (200),
constraint pk_RegistroVariable primary key (CodProfile), 
constraint fk_RegistroVariable foreign key (CodProfile)
references RegistroFijo (CodProfile)
);

create table test(
ID_RegV int not null auto_increment primary key, 
CodProfile varchar(50) not null
);

