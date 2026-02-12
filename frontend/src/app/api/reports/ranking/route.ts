import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { StudentRanking, ApiResponse } from '@/lib/definitions';
import { handleDatabaseError, handleValidationError } from '@/lib/error-handler';
import { z } from 'zod';

const RankingQuerySchema = z.object({
    limit: z.coerce.number().min(1).max(100).optional().default(10),
});

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const params = RankingQuerySchema.parse({
            limit: searchParams.get('limit') || '10',
        });

        const result = await query(
            `SELECT * FROM vw_student_ranking WHERE position <= $1 ORDER BY position ASC`,
            [params.limit]
        );

        const response: ApiResponse<StudentRanking[]> = {
            success: true,
            data: result.rows as StudentRanking[],
        };

        return NextResponse.json(response);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return handleValidationError(error);
        }
        return handleDatabaseError(error);
    }
}
