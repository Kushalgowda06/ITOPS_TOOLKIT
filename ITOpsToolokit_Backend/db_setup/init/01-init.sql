-- Set postgres superuser password
ALTER USER postgres WITH PASSWORD 'Postgres_2025';

-- Create app role (cluster-wide)
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'dbuser') THEN
      CREATE USER dbuser WITH PASSWORD 'Password_2025';
   END IF;
END $$ LANGUAGE plpgsql;

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(768),
    metadata JSONB
);

-- Create change_requests table
CREATE TABLE IF NOT EXISTS change_requests (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(768),
    metadata JSONB
);

-- Create config table
CREATE TABLE IF NOT EXISTS config (
    id SERIAL PRIMARY KEY,
    key TEXT,
    value TEXT
);

-- Create incidents table
CREATE TABLE IF NOT EXISTS incidents (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(768),
    metadata JSONB
);

-- Create kb_articles table
CREATE TABLE IF NOT EXISTS kb_articles (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(768),
    metadata JSONB
);

-- Create knowledge_articles table
CREATE TABLE IF NOT EXISTS knowledge_articles (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(768),
    metadata JSONB
);

-- Create prblm_tkt_details table
CREATE TABLE IF NOT EXISTS prblm_tkt_details (
    id BIGSERIAL PRIMARY KEY,
    short_description VARCHAR(500) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    associated_incidents TEXT NOT NULL,
    approval_status VARCHAR(20),
    problem_ticket_number VARCHAR(20),
    rejection_reason VARCHAR(200),
    approver VARCHAR(50),
    problem_ticket_link VARCHAR(300)
);

-- Create quizes table
CREATE TABLE IF NOT EXISTS quizes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    kb_number VARCHAR(10),
    start_time TIMESTAMP WITHOUT TIME ZONE,
    quiz JSONB,
    user_response TEXT,
    score DOUBLE PRECISION
);

-- Create service_requests table
CREATE TABLE IF NOT EXISTS service_requests (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(768),
    metadata JSONB
);

-- Transfer ownership to dbuser
ALTER TABLE articles OWNER TO dbuser;
ALTER TABLE change_requests OWNER TO dbuser;
ALTER TABLE incidents OWNER TO dbuser;
ALTER TABLE kb_articles OWNER TO dbuser;
ALTER TABLE knowledge_articles OWNER TO dbuser;
ALTER TABLE prblm_tkt_details OWNER TO dbuser;
ALTER TABLE quizes OWNER TO dbuser;
ALTER TABLE service_requests OWNER TO dbuser;

-- Grant access
GRANT USAGE ON SCHEMA public TO dbuser;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO dbuser;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO dbuser;

-- Future grants
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO dbuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO dbuser;
