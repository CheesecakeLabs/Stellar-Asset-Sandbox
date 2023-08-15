CREATE TABLE TransactionLogTypes(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255)
);

INSERT INTO TransactionLogTypes (name, description) VALUES
    ('Create Asset', 'Creation of a new asset'),
    ('Mint Asset', 'Increasing the quantity of an existing asset'),
    ('Update Auth Flags', 'Changing permissions or access controls for an asset'),
    ('Clawback Asset', 'Revoking or taking back an asset'),
    ('Burn Asset', 'Reducing the quantity of an existing asset'),
    ('Transfer Asset', 'Moving an asset from one account or user to another');
