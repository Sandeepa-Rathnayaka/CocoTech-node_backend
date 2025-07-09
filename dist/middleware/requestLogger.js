"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const requestLogger = (req, res, next) => {
    const start = process.hrtime();
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
    console.log(`\x1b[36m→ ${req.method}\x1b[0m ${req.originalUrl}`);
    const oldWrite = res.write;
    const oldEnd = res.end;
    const chunks = [];
    res.write = function (chunk) {
        chunks.push(Buffer.from(chunk));
        return oldWrite.apply(res, arguments);
    };
    res.end = function (chunk) {
        if (chunk) {
            chunks.push(Buffer.from(chunk));
        }
        const duration = process.hrtime(start);
        const durationMs = (duration[0] * 1000 + duration[1] / 1e6).toFixed(2);
        const body = Buffer.concat(chunks).toString('utf8');
        let responseBody;
        try {
            responseBody = JSON.parse(body);
        }
        catch (e) {
            responseBody = body;
        }
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
        const statusColor = res.statusCode >= 500 ? '\x1b[31m' :
            res.statusCode >= 400 ? '\x1b[33m' :
                res.statusCode >= 300 ? '\x1b[36m' :
                    '\x1b[32m';
        console.log(`${statusColor}← ${res.statusCode}\x1b[0m ${req.method} ${req.originalUrl} \x1b[33m${durationMs}ms\x1b[0m`);
        if (res.statusCode >= 400) {
        }
        else {
        }
        return oldEnd.apply(res, arguments);
    };
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=requestLogger.js.map