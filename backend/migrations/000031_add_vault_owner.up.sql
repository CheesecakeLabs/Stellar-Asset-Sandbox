ALTER TABLE vault
ADD COLUMN owner_id INT,
ADD CONSTRAINT fk_vault_owner_id
    FOREIGN KEY (owner_id)
    REFERENCES useraccount(id);