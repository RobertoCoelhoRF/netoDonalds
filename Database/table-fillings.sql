create table fillings (
	id integer,
	id_foods integer,
	name varchar,
	price real,
	primary key(id, id_foods),
	FOREIGN key (id_foods) references foods (id)
)

insert into fillings values(1, 1, 'Queijo', 1.50);
insert into fillings values(2, 1, 'Presunto', 1.20);
insert into fillings values(3, 1, 'Nutella', 5.50);

insert into fillings values(1, 2, 'Queijo', 1.50);
insert into fillings values(3, 2, 'Nutella', 5.50);

select name, price from fillings where id_foods = 2