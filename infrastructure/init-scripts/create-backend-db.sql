SELECT 'CREATE DATABASE backend'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'backend')\gexec