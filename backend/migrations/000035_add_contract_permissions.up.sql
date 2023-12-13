DO $$ 
DECLARE 
    permission_id INT;
BEGIN
    INSERT INTO Permission (name, description) VALUES ('Create certificates', '') RETURNING id INTO permission_id;
    EXECUTE format('INSERT INTO Operation (name, description, permission_id, action) VALUES (%L, %L, %s, %L)', 'Create certificates', '', permission_id, 'create-certificates');
    EXECUTE format('INSERT INTO RolePermissionJunction (role_id, permission_id) VALUES (%s, %s)', 1, permission_id);
END $$;

DO $$ 
DECLARE 
    permission_id INT;
BEGIN
    INSERT INTO Permission (name, description) VALUES ('Create wallet', '') RETURNING id INTO permission_id;
    EXECUTE format('INSERT INTO Operation (name, description, permission_id, action) VALUES (%L, %L, %s, %L)', 'Create wallet', '', permission_id, 'create-wallet');
    EXECUTE format('INSERT INTO RolePermissionJunction (role_id, permission_id) VALUES (%s, %s)', 1, permission_id);
END $$;


DO $$ 
DECLARE 
    permission_id INT;
BEGIN
    INSERT INTO Permission (name, description) VALUES ('Invest in the certificate', '') RETURNING id INTO permission_id;
    EXECUTE format('INSERT INTO Operation (name, description, permission_id, action) VALUES (%L, %L, %s, %L)', 'Invest in the certificate', '', permission_id, 'invest-certificate');
    EXECUTE format('INSERT INTO RolePermissionJunction (role_id, permission_id) VALUES (%s, %s)', 1, permission_id);
END $$;
