CREATE INDEX idx_student_email ON students(email);
CREATE INDEX idx_enrollment_student ON enrollments(student_id);
CREATE INDEX idx_attendance_date ON attendance(date);