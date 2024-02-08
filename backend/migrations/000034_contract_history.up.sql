CREATE TABLE ContractsHistory (
    id SERIAL PRIMARY KEY,
    contract_id INT NOT NULL,
    deposited_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deposit_amount FLOAT NOT NULL,
    withdrawn_at TIMESTAMP,
    withdraw_amount FLOAT,
    user_id INT NOT NULL,
    FOREIGN KEY (contract_id) REFERENCES Contracts(id),
    FOREIGN KEY (user_id) REFERENCES UserAccount(id)
);