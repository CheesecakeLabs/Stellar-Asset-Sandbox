DELETE FROM RolePermissionJunction
WHERE role_id IN (SELECT id FROM Role WHERE admin = 1);
