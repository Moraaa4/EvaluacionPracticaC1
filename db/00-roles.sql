-- Crear rol con la contraseña correcta
CREATE ROLE app_user WITH LOGIN PASSWORD 'password_para_la_app_2026';

-- Permisos básicos de conexión
GRANT CONNECT ON DATABASE academy_db TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;

-- Permisos en tablas existentes
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_user;

-- Permisos en vistas específicas
GRANT SELECT ON vw_course_performance TO app_user;
GRANT SELECT ON vw_teacher_load TO app_user;
GRANT SELECT ON vw_students_at_risk TO app_user;
GRANT SELECT ON vw_group_attendance TO app_user;
GRANT SELECT ON vw_student_ranking TO app_user;

-- Permisos automáticos para tablas y vistas futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO app_user;