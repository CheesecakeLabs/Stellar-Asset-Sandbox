TRUNCATE operation;

insert into operation (name,description,permission_id,action) values ('Add / Remove users','',1,'add-remove-users');
insert into operation (name,description,permission_id,action) values ('Assign Roles','',1,'assign-roles');
insert into operation (name,description,permission_id,action) values ('Customize roles','',1,'customize-roles');
insert into operation (name,description,permission_id,action) values ('Approve new accounts','',3,'approve-new-accounts');
insert into operation (name,description,permission_id,action) values ('Freeze / Unfreeze','',3,'freeze-unfreeze');
insert into operation (name,description,permission_id,action) values ('Clawback','',3,'clawback');
insert into operation (name,description,permission_id,action) values ('Edit user profile',' ',1,'edit-users-role');
insert into operation (name,description,permission_id,action) values ('Create asset','',3,'create-asset');
insert into operation (name,description,permission_id,action) values ('Mint Asset','',3,'mint');
insert into operation (name,description,permission_id,action) values ('Burn Asset','',3,'burn');
insert into operation (name,description,permission_id,action) values ('Distribute Asset','',3,'transfer');
insert into operation (name,description,permission_id,action) values ('Clawback','',3,'clawback');
insert into operation (name,description,permission_id,action) values ('Authorize Asset','',3,'authorize');
insert into operation (name,description,permission_id,action) values ('Freeze Account','',3,'update-auth-flags');
insert into operation (name,description,permission_id,action) values ('Move balances between vaults','',4,'move-balances-vaults');
insert into operation (name,description,permission_id,action) values ('Move balances to external accounts','',5,'move-balances-external-accounts');