import { NextResponse } from 'next/server';

export class DatabaseError extends Error {
    constructor(message: string, public code?: string) {
        super(message);
        this.name = 'DatabaseError';
    }
}

export function handleDatabaseError(error: unknown): NextResponse {
    console.error('Database error:', error);

    if (error instanceof Error) {
        // PostgreSQL error codes
        const pgError = error as any;

        if (pgError.code) {
            switch (pgError.code) {
                case '23505': // unique_violation
                    return NextResponse.json(
                        { success: false, error: 'DUPLICATE_ENTRY', message: 'Ya existe un registro con estos datos' },
                        { status: 409 }
                    );
                case '23503': // foreign_key_violation
                    return NextResponse.json(
                        { success: false, error: 'FOREIGN_KEY_VIOLATION', message: 'Error de integridad referencial' },
                        { status: 400 }
                    );
                case '23502': // not_null_violation
                    return NextResponse.json(
                        { success: false, error: 'MISSING_REQUIRED_FIELD', message: 'Falta un campo requerido' },
                        { status: 400 }
                    );
                case 'ECONNREFUSED':
                    return NextResponse.json(
                        { success: false, error: 'DB_CONNECTION_ERROR', message: 'No se pudo conectar a la base de datos' },
                        { status: 503 }
                    );
            }
        }

        return NextResponse.json(
            { success: false, error: 'DATABASE_ERROR', message: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json(
        { success: false, error: 'UNKNOWN_ERROR', message: 'Ocurrió un error inesperado' },
        { status: 500 }
    );
}

export function handleValidationError(error: unknown): NextResponse {
    console.error('Validation error:', error);

    return NextResponse.json(
        { success: false, error: 'VALIDATION_ERROR', message: 'Parámetros inválidos' },
        { status: 400 }
    );
}
