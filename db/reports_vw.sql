CREATE VIEW vw_course_performance AS
SELECT 
    c.name AS course_name,
    g.term,
    s.program,
    ROUND(AVG((gr.partial1 + gr.partial2 + gr.final_exam)/3), 2) AS general_avg,
    COUNT(CASE WHEN (gr.partial1 + gr.partial2 + gr.final_exam)/3 >= 7 THEN 1 END) AS passed_count,
    COUNT(CASE WHEN (gr.partial1 + gr.partial2 + gr.final_exam)/3 < 7 THEN 1 END) AS failed_count
FROM courses c
JOIN groups g ON c.id = g.course_id
JOIN enrollments e ON g.id = e.group_id
JOIN students s ON e.student_id = s.id
LEFT JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY c.name, g.term, s.program;

CREATE VIEW vw_teacher_load AS
SELECT 
    t.name AS teacher_name,
    g.term,
    COUNT(DISTINCT g.id) AS groups_count,
    COUNT(e.id) AS total_students
FROM teachers t
JOIN groups g ON t.id = g.teacher_id
JOIN enrollments e ON g.id = e.group_id
GROUP BY t.name, g.term
HAVING COUNT(e.id) > 0;

CREATE VIEW vw_students_at_risk AS
WITH risk_data AS (
    SELECT 
        s.name, 
        s.email,
        AVG((gr.partial1 + gr.partial2 + gr.final_exam)/3) as avg_grade,
        COALESCE(COUNT(CASE WHEN att.present THEN 1 END)::FLOAT / NULLIF(COUNT(att.id), 0) * 100, 0) as att_rate
    FROM students s
    JOIN enrollments e ON s.id = e.student_id
    LEFT JOIN grades gr ON e.id = gr.enrollment_id
    LEFT JOIN attendance att ON e.id = att.enrollment_id
    GROUP BY s.name, s.email
)
SELECT name, email, avg_grade, att_rate 
FROM risk_data 
WHERE avg_grade < 7 OR att_rate < 80;

CREATE VIEW vw_attendance_by_group AS
SELECT 
    g.id AS group_id,
    g.term,
    COALESCE(AVG(CASE WHEN a.present THEN 100 ELSE 0 END), 0) as avg_attendance
FROM groups g
LEFT JOIN enrollments e ON g.id = e.group_id
LEFT JOIN attendance a ON e.id = a.enrollment_id
GROUP BY g.id, g.term;

CREATE VIEW vw_rank_students AS
SELECT 
    s.name,
    s.program,
    g.term,
    AVG((gr.partial1 + gr.partial2 + gr.final_exam)/3) as score,
    RANK() OVER (PARTITION BY s.program, g.term ORDER BY AVG((gr.partial1 + gr.partial2 + gr.final_exam)/3) DESC) as position
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN groups g ON e.group_id = g.id
JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY s.name, s.program, g.term;