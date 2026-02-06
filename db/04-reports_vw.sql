-- 1. Rendimiento por Curso
CREATE OR REPLACE VIEW vw_course_performance AS
SELECT 
    c.name AS course_name,
    g.term,
    s.program,
    ROUND(AVG((COALESCE(gr.partial1,0) + COALESCE(gr.partial2,0) + COALESCE(gr.final_exam,0))/3), 2) AS general_avg,
    COUNT(CASE WHEN (gr.partial1 + gr.partial2 + gr.final_exam)/3 >= 7 THEN 1 END)::INT AS passed_count,
    COUNT(CASE WHEN (gr.partial1 + gr.partial2 + gr.final_exam)/3 < 7 THEN 1 END)::INT AS failed_count
FROM courses c
JOIN groups g ON c.id = g.course_id
JOIN enrollments e ON g.id = e.group_id
JOIN students s ON e.student_id = s.id
LEFT JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY c.name, g.term, s.program;

-- 2. Carga Docente
CREATE OR REPLACE VIEW vw_teacher_load AS
SELECT 
    t.name AS teacher_name,
    g.term,
    COUNT(DISTINCT g.id)::INT AS groups_count,
    COUNT(e.id)::INT AS total_students
FROM teachers t
JOIN groups g ON t.id = g.teacher_id
JOIN enrollments e ON g.id = e.group_id
GROUP BY t.name, g.term;

-- 3. Alumnos en Riesgo 
CREATE OR REPLACE VIEW vw_students_at_risk AS
WITH risk_data AS (
    SELECT 
        s.name, 
        s.email,
        ROUND(AVG((COALESCE(gr.partial1,0) + COALESCE(gr.partial2,0) + COALESCE(gr.final_exam,0))/3), 2) as avg_grade,
        ROUND(COALESCE(COUNT(CASE WHEN att.present THEN 1 END)::FLOAT / NULLIF(COUNT(att.id), 0) * 100, 0)::numeric, 2) as att_rate
    FROM students s
    JOIN enrollments e ON s.id = e.student_id
    LEFT JOIN grades gr ON e.id = gr.enrollment_id
    LEFT JOIN attendance att ON e.id = att.enrollment_id
    GROUP BY s.name, s.email
)
SELECT name, email, avg_grade, att_rate 
FROM risk_data 
WHERE avg_grade < 7 OR att_rate < 80;

-- 4. Asistencia por Grupo 
CREATE OR REPLACE VIEW vw_group_attendance AS
SELECT 
    c.name AS course_name,
    g.term,
    ROUND(COALESCE(AVG(CASE WHEN a.present THEN 100 ELSE 0 END), 0)::numeric, 2) as avg_attendance
FROM groups g
JOIN courses c ON g.course_id = c.id
LEFT JOIN enrollments e ON g.id = e.group_id
LEFT JOIN attendance a ON e.id = a.enrollment_id
GROUP BY c.name, g.term;

-- 5. Ranking de Alumnos
CREATE OR REPLACE VIEW vw_student_ranking AS
SELECT 
    s.name AS student_name,
    s.program,
    g.term,
    ROUND(AVG((COALESCE(gr.partial1,0) + COALESCE(gr.partial2,0) + COALESCE(gr.final_exam,0))/3), 2) as score,
    RANK() OVER (PARTITION BY s.program, g.term ORDER BY AVG((gr.partial1 + gr.partial2 + gr.final_exam)/3) DESC)::INT as position
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN groups g ON e.group_id = g.id
JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY s.name, s.program, g.term;

-- Permisos finales para app_user
GRANT SELECT ON vw_course_performance TO app_user;
GRANT SELECT ON vw_teacher_load TO app_user;
GRANT SELECT ON vw_students_at_risk TO app_user;
GRANT SELECT ON vw_group_attendance TO app_user;
GRANT SELECT ON vw_student_ranking TO app_user;