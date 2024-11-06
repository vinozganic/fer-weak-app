import { Response } from 'express';

export function handleErrorRoute(res: Response, error: any) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'An unexpected error occurred';
    res.redirect(`/error?code=${statusCode}&message=${encodeURIComponent(message)}`);
}
