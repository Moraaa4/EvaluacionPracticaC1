import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { CoursePerformance, ApiResponse } from '@/lib/definitions';
import { handleDatabaseError, handleValidationError } from '@/lib/error-handler';
import { z } from 'zod';

const PerformanceQuerySchema = z.object({
    term: z.string().optional().default('2025-1'),
});

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const params = PerformanceQuerySchema.parse({
            term: searchParams.get('term') || '2025-1',
        });

        const result = await query(
            `SELECT * FROM vw_course_performance WHERE term = $1 ORDER BY course_name, program`,
            [params.term]
        );

        const response: ApiResponse<CoursePerformance[]> = {
            success: true,
            data: result.rows as CoursePerformance[],
        };

        return NextResponse.json(response);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return handleValidationError(error);
        }
        return handleDatabaseError(error);
    }
}
