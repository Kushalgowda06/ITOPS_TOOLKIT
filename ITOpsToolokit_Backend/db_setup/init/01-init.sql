-- Set postgres superuser password
ALTER USER postgres WITH PASSWORD 'Postgres_2025';

-- Create application database (runs only on first init of the data dir)
CREATE DATABASE cfs_problem_tickets;

-- Create app role (cluster-wide)
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'dbuser') THEN
      CREATE USER dbuser WITH PASSWORD 'Password_2025';
   END IF;
END $$ LANGUAGE plpgsql;

-- Switch to application database
\connect cfs_problem_tickets

-- Enable pgvector in the app database
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table if not exists
CREATE TABLE IF NOT EXISTS prblm_tkt_details (
  id SERIAL PRIMARY KEY,
  short_description VARCHAR(500) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  associated_incidents TEXT NOT NULL,
  approval_status VARCHAR(20),
  problem_ticket_number VARCHAR(20),
  rejection_reason VARCHAR(200),
  approver VARCHAR(50),
  problem_ticket_link VARCHAR(300)
);

-- Transfer ownership to dbuser
ALTER TABLE prblm_tkt_details OWNER TO dbuser;

-- Grant access
GRANT CONNECT ON DATABASE cfs_problem_tickets TO dbuser;
GRANT USAGE ON SCHEMA public TO dbuser;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO dbuser;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO dbuser;

-- Future grants
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO dbuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO dbuser;
