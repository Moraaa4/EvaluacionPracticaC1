import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { TeacherLoad, ApiResponse } from '@/lib/definitions';
import { handleDatabaseError, handleValidationError } from '@/lib/error-handler';
import { z } from 'zod';

const TeacherLoadQuerySchema = z.object({
    term: z.string().optional().default('2025-1'),
});

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const params = TeacherLoadQuerySchema.parse({
            term: searchParams.get('term') || '2025-1',
        });

        const result = await query(
            `SELECT * FROM vw_teacher_load WHERE term = $1 ORDER BY teacher_name`,
            [params.term]
        );

        const response: ApiResponse<TeacherLoad[]> = {
            success: true,
            data: result.rows as TeacherLoad[],
        };

        return NextResponse.json(response);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return handleValidationError(error);
        }
        return handleDatabaseError(error);
    }
}
