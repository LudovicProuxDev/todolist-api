#!/bin/sh
# Create one user per database (run by the postgres image on the first start only):
# todolist_app owns todolist, todolist_test owns todolist_test, root stays for administration.
set -e

psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d postgres \
  -v app_password="$APP_DB_PASSWORD" -v test_password="$TEST_DB_PASSWORD" <<'SQL'
CREATE USER todolist_app WITH PASSWORD :'app_password';
ALTER DATABASE todolist OWNER TO todolist_app;
REVOKE CONNECT ON DATABASE todolist FROM PUBLIC;

-- CREATEDB: the test suite (Foundry) drops and recreates its database
CREATE USER todolist_test WITH CREATEDB PASSWORD :'test_password';
CREATE DATABASE todolist_test OWNER todolist_test;
REVOKE CONNECT ON DATABASE todolist_test FROM PUBLIC;
SQL
