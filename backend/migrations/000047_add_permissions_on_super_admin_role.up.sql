WITH SuperAdminRole AS (
    SELECT id
    FROM Role
    WHERE admin = 1
    LIMIT 1
)

INSERT INTO RolePermissionJunction (role_id, permission_id)
SELECT sar.id, p.id
FROM SuperAdminRole sar
CROSS JOIN Permission p;