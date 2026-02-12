import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { StudentAtRisk, PaginatedResponse } from '@/lib/definitions';
import { handleDatabaseError, handleValidationError } from '@/lib/error-handler';
import { z } from 'zod';

const AtRiskQuerySchema = z.object({
    query: z.string().optional().default(''),
    page: z.coerce.number().min(1).optional().default(1),
    limit: z.coerce.number().min(1).max(100).optional().default(10),
});

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const params = AtRiskQuerySchema.parse({
            query: searchParams.get('query') || '',
            page: searchParams.get('page') || '1',
            limit: searchParams.get('limit') || '10',
        });

        const offset = (params.page - 1) * params.limit;
        const searchTerm = `%${params.query}%`;

        // Obtener total de registros
        const countResult = await query(
            `SELECT COUNT(*) as total FROM vw_students_at_risk 
       WHERE name ILIKE $1 OR email ILIKE $1`,
            [searchTerm]
        );

        const total = parseInt(countResult.rows[0].total);
        const totalPages = Math.ceil(total / params.limit);

        // Obtener datos paginados
        const dataResult = await query(
            `SELECT * FROM vw_students_at_risk 
       WHERE name ILIKE $1 OR email ILIKE $1 
       ORDER BY avg_grade ASC, att_rate ASC
       LIMIT $2 OFFSET $3`,
            [searchTerm, params.limit, offset]
        );

        const response: PaginatedResponse<StudentAtRisk> = {
            success: true,
            data: dataResult.rows as StudentAtRisk[],
            total,
            page: params.page,
            limit: params.limit,
            totalPages,
        };

        return NextResponse.json(response);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return handleValidationError(error);
        }
        return handleDatabaseError(error);
    }
}
