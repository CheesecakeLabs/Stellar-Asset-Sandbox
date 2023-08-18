CREATE TABLE IF NOT EXISTS UserAccount(
    id serial PRIMARY KEY,
    name VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES Role(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
