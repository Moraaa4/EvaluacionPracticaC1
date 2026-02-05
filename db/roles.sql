CREATE ROLE app_user WITH LOGIN PASSWORD 'password_para_la_app_2026';
GRANT CONNECT ON DATABASE academy_db TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT ON ALL VIEWS IN SCHEMA public TO app_user;