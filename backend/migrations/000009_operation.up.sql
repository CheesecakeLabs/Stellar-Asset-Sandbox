CREATE TABLE Operation (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    permission_id INT NOT NULL,
    FOREIGN KEY (permission_id) REFERENCES Permission(id)
);