import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const requestLogger = (req: Request, res: any, next: NextFunction) => {
    // Get the start time of the request
    const start = process.hrtime();

    // Store full request details for logging
    const requestLog = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        queryParams: req.query,
        body: req.body,
        headers: {
            ...req.headers,
            authorization: req.headers.authorization ? '[REDACTED]' : undefined
        },
        ip: req.ip,
        userAgent: req.get('user-agent')
    };

    // Log minimal request info to console
    console.log(`\x1b[36m→ ${req.method}\x1b[0m ${req.originalUrl}`);

    // Capture the response
    const oldWrite = res.write;
    const oldEnd = res.end;
    const chunks: Buffer[] = [];

    res.write = function (chunk: Buffer) {
        chunks.push(Buffer.from(chunk));
        return oldWrite.apply(res, arguments as any);
    };

    res.end = function (chunk: Buffer) {
        if (chunk) {
            chunks.push(Buffer.from(chunk));
        }
        
        // Calculate request duration
        const duration = process.hrtime(start);
        const durationMs = (duration[0] * 1000 + duration[1] / 1e6).toFixed(2);

        // Construct response body
        const body = Buffer.concat(chunks).toString('utf8');
        let responseBody;
        try {
            responseBody = JSON.parse(body);
        } catch (e) {
            responseBody = body;
        }

        // Store full response details for logging
        const responseLog = {
            timestamp: new Date().toISOString(),
            duration: `${durationMs}ms`,
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.getHeaders(),
            body: responseBody,
            requestId: req.get('X-Request-ID')
        };

        // Log status with color based on status code
        const statusColor = res.statusCode >= 500 ? '\x1b[31m' : // Red for 5xx
                          res.statusCode >= 400 ? '\x1b[33m' : // Yellow for 4xx
                          res.statusCode >= 300 ? '\x1b[36m' : // Cyan for 3xx
                          '\x1b[32m'; // Green for 2xx

        // Log minimal response info to console
        console.log(`${statusColor}← ${res.statusCode}\x1b[0m ${req.method} ${req.originalUrl} \x1b[33m${durationMs}ms\x1b[0m`);

        // Keep full logging to file
        if (res.statusCode >= 400) {
            // logger.error('Request Error', { 
            //     request: requestLog, 
            //     response: responseLog 
            // });
        } else {
            // logger.info('Request Completed', { 
            //     request: requestLog, 
            //     response: responseLog 
            // });
        }

        return oldEnd.apply(res, arguments as any);
    };

    next();
};