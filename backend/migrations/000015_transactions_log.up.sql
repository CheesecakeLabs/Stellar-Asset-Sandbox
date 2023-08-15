CREATE TABLE TransactionsLog (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES UserAccount(id),
    type_id INTEGER REFERENCES TransactionLogTypes(id),
    asset_id INTEGER REFERENCES Asset(id),
    date TIMESTAMPTZ DEFAULT now(),
    description VARCHAR(255)
);
