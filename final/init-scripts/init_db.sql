DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'final') THEN
        CREATE DATABASE "final";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'roma') THEN
        CREATE USER roma WITH ENCRYPTED PASSWORD 'Qwerty123';
    END IF;
END $$;

GRANT ALL PRIVILEGES ON DATABASE "final" TO roma;

CREATE TABLE orders (
        name text,
        room text,
        message text
);