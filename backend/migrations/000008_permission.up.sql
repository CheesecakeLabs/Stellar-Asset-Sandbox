CREATE TABLE Permission (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255)
);

insert into permission (id, name, description) values (1, 'Manage users and roles', '');
insert into permission (id, name, description) values (2, 'Manage System Wallets', '');
insert into permission (id, name, description) values (3, 'Open Asset Management Request', '');
insert into permission (id, name, description) values (4, 'Distribute Internally', '');
insert into permission (id, name, description) values (5, 'Distribute Externally', '');
insert into permission (id, name, description) values (6, 'Approval Workflow', '');

ALTER SEQUENCE permission_id_seq RESTART WITH 6;