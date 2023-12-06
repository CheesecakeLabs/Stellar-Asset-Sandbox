DO $$ 
DECLARE 
    permission_id INT;
BEGIN
    -- Revert 'Invest in the certificate'
    SELECT id INTO permission_id FROM Permission WHERE name = 'Invest in the certificate';
    DELETE FROM RolePermissionJunction WHERE permission_id = permission_id;
    DELETE FROM Operation WHERE permission_id = permission_id;
    DELETE FROM Permission WHERE id = permission_id;

    -- Revert 'Create wallet'
    SELECT id INTO permission_id FROM Permission WHERE name = 'Create wallet';
    DELETE FROM RolePermissionJunction WHERE permission_id = permission_id;
    DELETE FROM Operation WHERE permission_id = permission_id;
    DELETE FROM Permission WHERE id = permission_id;

    -- Revert 'Create certificates'
    SELECT id INTO permission_id FROM Permission WHERE name = 'Create certificates';
    DELETE FROM RolePermissionJunction WHERE permission_id = permission_id;
    DELETE FROM Operation WHERE permission_id = permission_id;
    DELETE FROM Permission WHERE id = permission_id;
END $$;
