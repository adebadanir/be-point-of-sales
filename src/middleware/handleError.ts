import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack || err);
    const status: number = err.status || 500;
    const message = err.message || 'Internal Server Error';

    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: err.issues.map((e) => ({
                path: e.path.join('.'),
                message: e.message,
                expected: (e as any).expected ?? undefined,
            })),
        });
    }

    res.status(status).json({
        success: false,
        message,
    });
}