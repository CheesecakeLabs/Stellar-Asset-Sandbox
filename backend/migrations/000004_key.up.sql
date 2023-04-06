CREATE TABLE Key (
    id SERIAL PRIMARY KEY,
    public_key VARCHAR(56) NOT NULL,
    weight INT NOT NULL,
    wallet_id INT NOT NULL,
    FOREIGN KEY (wallet_id) REFERENCES Wallet(id)
);