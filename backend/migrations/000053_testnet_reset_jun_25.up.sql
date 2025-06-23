TRUNCATE TABLE logtransactions CASCADE;
TRUNCATE TABLE contractshistory CASCADE;
TRUNCATE TABLE contracts CASCADE;
TRUNCATE TABLE vault CASCADE;
TRUNCATE TABLE vaultcategory CASCADE;
TRUNCATE TABLE asset CASCADE;
TRUNCATE TABLE key CASCADE;
TRUNCATE TABLE wallet CASCADE;
TRUNCATE TABLE useraccount CASCADE;
TRUNCATE TABLE toml CASCADE;

ALTER SEQUENCE public.key_id_seq RESTART 1;
ALTER SEQUENCE public.wallet_id_seq RESTART 1;
ALTER SEQUENCE public.asset_id_seq RESTART 1;

INSERT INTO role (id, name, admin) VALUES (1, 'Admin', 0);
INSERT INTO role (id, name, admin) VALUES (2, 'Asset Manager', 0);
INSERT INTO role (id, name, admin) VALUES (3, 'Analyst', 0);
INSERT INTO role (id, name, admin) VALUES (4, 'SuperAdmin', 1);