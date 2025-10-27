# Custom Postgres (with pgvector) image with config and init SQL
FROM pgvector/pgvector:pg16

# Copy PostgreSQL configuration files
COPY postgresql.conf /etc/postgresql/postgresql.conf
COPY pg_hba.conf /etc/postgresql/pg_hba.conf

# Copy initialization SQL (executed only on first run when PGDATA is empty)
COPY init/*.sql /docker-entrypoint-initdb.d/

# Ensure permissions
RUN chown -R postgres:postgres /etc/postgresql

EXPOSE 5432

# Run Postgres with our config files
# Entrypoint remains the upstream docker-entrypoint.sh which will handle initdb and then exec this CMD
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf", "-c", "hba_file=/etc/postgresql/pg_hba.conf"]
