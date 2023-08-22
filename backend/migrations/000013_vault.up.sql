CREATE TABLE Vault (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    vault_category_id INT NOT NULL,
    wallet_id INT NOT NULL,
    FOREIGN KEY (vault_category_id) REFERENCES VaultCategory(id),
    FOREIGN KEY (wallet_id) REFERENCES Wallet(id)
);