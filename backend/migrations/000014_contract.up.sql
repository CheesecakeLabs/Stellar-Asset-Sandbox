CREATE TABLE Contracts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(96) NOT NULL,
    address VARCHAR(256) NOT NULL,
    yield_rate INT NOT NULL,
    term INT NOT NULL,
    min_deposit INT NOT NULL,
    penalty_rate INT NOT NULL,
    vault_id INT NOT NULL,
    asset_id INT NOT NULL,
    FOREIGN KEY (vault_id) REFERENCES Vault(id),
    FOREIGN KEY (asset_id) REFERENCES Asset(id)
);