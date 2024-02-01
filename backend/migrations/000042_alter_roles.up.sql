ALTER TABLE Role
ADD COLUMN created_by integer,
ADD COLUMN created_at timestamp without time zone DEFAULT NOW(),


-- Add a foreign key constraint to 'created_by' referencing 'useraccount.id'
ADD CONSTRAINT fk_role_created_by
FOREIGN KEY (created_by)
REFERENCES UserAccount (id);