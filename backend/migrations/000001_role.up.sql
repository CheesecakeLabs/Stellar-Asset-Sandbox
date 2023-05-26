CREATE TABLE Role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO role (id, name) VALUES (1, 'Admin');
INSERT INTO role (id, name) VALUES (2, 'Asset Manager');
INSERT INTO role (id, name) VALUES (3, 'Treasurer');