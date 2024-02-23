UPDATE Role SET admin = 0 WHERE admin = 1;
INSERT INTO Role (id, name, admin) VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM Role), 'SuperAdmin', 1);