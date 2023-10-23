CREATE TABLE RolePermissionJunction (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    CONSTRAINT role_permission_pk PRIMARY KEY (role_id, permission_id),
    CONSTRAINT FK_role 
        FOREIGN KEY (role_id) REFERENCES Role (id),
    CONSTRAINT FK_permission 
        FOREIGN KEY (permission_id) REFERENCES Permission (id) ON DELETE CASCADE
);

insert into rolepermissionjunction (role_id, permission_id) values (1, 1);
insert into rolepermissionjunction (role_id, permission_id) values (1, 2);
insert into rolepermissionjunction (role_id, permission_id) values (1, 3);
insert into rolepermissionjunction (role_id, permission_id) values (1, 4);
insert into rolepermissionjunction (role_id, permission_id) values (1, 5);
insert into rolepermissionjunction (role_id, permission_id) values (1, 6);
insert into rolepermissionjunction (role_id, permission_id) values (2, 3);
insert into rolepermissionjunction (role_id, permission_id) values (2, 4);
insert into rolepermissionjunction (role_id, permission_id) values (2, 5);
insert into rolepermissionjunction (role_id, permission_id) values (2, 6);
insert into rolepermissionjunction (role_id, permission_id) values (3, 4);
insert into rolepermissionjunction (role_id, permission_id) values (3, 5);
insert into rolepermissionjunction (role_id, permission_id) values (3, 6);
