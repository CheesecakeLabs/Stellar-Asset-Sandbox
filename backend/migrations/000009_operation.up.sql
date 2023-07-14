CREATE TABLE Operation (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    permission_id INT NOT NULL,
    action VARCHAR(255),
    FOREIGN KEY (permission_id) REFERENCES Permission(id)
);

insert into operation (id, name, description, permission_id, action) values (1, 'Add / Remove users', '', 1, 'add-remove-users');
insert into operation (id, name, description, permission_id, action) values (2, 'Assign Roles', '', 1, 'assign-roles');
insert into operation (id, name, description, permission_id, action) values (3, 'Customize roles', '', 1, 'customize-roles');
insert into operation (id, name, description, permission_id, action) values (4, 'Create / maintain asset', '', 3, 'create-maintain-asset');
insert into operation (id, name, description, permission_id, action) values (5, 'Mint / Burn', '', 3, 'mint-burn');
insert into operation (id, name, description, permission_id, action) values (6, 'Approve new accounts', '', 3, 'approve-new-accounts');
insert into operation (id, name, description, permission_id, action) values (7, 'Freeze / Unfreeze', '', 3, 'freeze-unfreeze');
insert into operation (id, name, description, permission_id, action) values (8, 'Clawback', '', 3, 'clawback');
insert into operation (id, name, description, permission_id, action) values (9, 'Move balances between treasury accounts', '', 4, 'move-balances-between-treasury-accounts');
insert into operation (id, name, description, permission_id, action) values (10, 'Move balances to external accounts', '', 5, 'move-balances-to-external-accounts');