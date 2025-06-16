create table payments (
	id serial primary key,
	id_foods integer,
	cpf varchar,
	pay_date date,
	description varchar,
	price real,
	FOREIGN KEY (id_foods) REFERENCES foods (id)
);

insert into payments(id_foods, cpf, pay_date, description, price)
values(1, '111', '27/05/25', 'Tapico com nutella', 10.50);

insert into payments(id_foods, cpf, pay_date, description, price)
values(2, '111', '27/05/25', 'Cuzcuz com queijo', 6.50);

insert into payments(id_foods, cpf, pay_date, description, price)
values(2, '222', '27/05/25', 'Cuzcuz com queijo e presunto', 8.50);

select * from payments;

select * from payments where cpf = '111';