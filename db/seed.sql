INSERT INTO students (name, email, program, enrollment_year) VALUES
('Mora Rivera', 'mora@univ.edu', 'Software', 2024),
('Ana López', 'ana@univ.edu', 'Software', 2024),
('Juan Pérez', 'juan@univ.edu', 'Sistemas', 2023),
('Carla Gómez', 'carla@univ.edu', 'Software', 2024),
('Luis Torres', 'luis@univ.edu', 'Sistemas', 2023),
('Elena Ruiz', 'elena@univ.edu', 'Software', 2024),
('Mario Díaz', 'mario@univ.edu', 'Sistemas', 2023);

INSERT INTO teachers (name, email) VALUES 
('Dr. Smith', 'smith@univ.edu'), 
('Ing. García', 'garcia@univ.edu');

INSERT INTO courses (code, name, credits) VALUES 
('AWOS101', 'Desarrollo Web', 5), 
('BDA202', 'Bases de Datos', 5);

INSERT INTO groups (course_id, teacher_id, term) VALUES 
(1, 1, '2025-1'), 
(2, 2, '2025-1');

INSERT INTO enrollments (student_id, group_id) VALUES 
(1, 1), (2, 1), (3, 2), (4, 2), (5, 1), (6, 1), (7, 2);

INSERT INTO grades (enrollment_id, partial1, partial2, final_exam) VALUES 
(1, 9.5, 8.0, 9.0), 
(2, 5.0, 4.0, 6.0), 
(3, 10, 9.5, 10), 
(4, 6.0, 5.5, 5.0),
(5, 8.0, 7.5, 8.5),
(6, 4.0, 3.0, 2.0);

INSERT INTO attendance (enrollment_id, date, present) VALUES 
(1, '2025-02-01', true), (1, '2025-02-02', true), 
(2, '2025-02-01', false), (2, '2025-02-02', false),
(6, '2025-02-01', false);