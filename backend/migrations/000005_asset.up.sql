CREATE TABLE Asset (
    id SERIAL PRIMARY KEY,
    code VARCHAR(12) NOT NULL,
    distributor_id INT NOT NULL,
    issuer_id INT NOT NULL,
    FOREIGN KEY (distributor_id) REFERENCES Wallet(id),
    FOREIGN KEY (issuer_id) REFERENCES Wallet(id)
);