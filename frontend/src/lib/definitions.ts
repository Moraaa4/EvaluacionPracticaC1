import { z } from 'zod';

// Schemas de validación
export const SearchSchema = z.object({
  query: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  term: z.string().optional().default('2025-1'),
  program: z.string().optional(),
});

// Tipos para las respuestas de las vistas
export type CoursePerformance = {
  course_name: string;
  term: string;
  program: string;
  general_avg: number;
  passed_count: number;
  failed_count: number;
};

export type StudentAtRisk = {
  name: string;
  email: string;
  avg_grade: number;
  att_rate: number;
};

export type GroupAttendance = {
  course_name: string;
  term: string;
  avg_attendance: number;
};

export type StudentRanking = {
  student_name: string;
  program: string;
  term: string;
  score: number;
  position: number;
};

export type TeacherLoad = {
  teacher_name: string;
  term: string;
  groups_count: number;
  total_students: number;
};

// Tipos para respuestas de API
export type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
  message: string;
};

export type PaginatedResponse<T> = {
  success: true;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} | {
  success: false;
  error: string;
  message: string;
};