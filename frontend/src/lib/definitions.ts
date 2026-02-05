import { z } from 'zod';

export const SearchSchema = z.object({
  query: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(5),
  term: z.string().optional(),
  program: z.string().optional(),
});

export type StudentAtRisk = {
  name: string;
  email: string;
  avg_grade: number;
  att_rate: number;
};