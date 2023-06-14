CREATE TABLE RolePermissionJunction (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    CONSTRAINT role_permission_pk PRIMARY KEY (role_id, permission_id),
    CONSTRAINT FK_role 
        FOREIGN KEY (role_id) REFERENCES Role (id),
    CONSTRAINT FK_permission 
        FOREIGN KEY (permission_id) REFERENCES Permission (id)
);