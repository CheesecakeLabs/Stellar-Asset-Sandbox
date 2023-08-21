CREATE TABLE LogTransactions (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES UserAccount(id),
    transaction_type_id INTEGER REFERENCES LogTransactionTypes(id),
    asset_id INTEGER REFERENCES Asset(id),
    amount FLOAT,
    date TIMESTAMPTZ DEFAULT now(),
    description VARCHAR(255)
);
