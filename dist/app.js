"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const hpp_1 = __importDefault(require("hpp"));
const routes_1 = __importDefault(require("./routes"));
const config_1 = require("./config");
const errorHandler_1 = require("./middleware/errorHandler");
const requestLogger_1 = require("./middleware/requestLogger");
const logger_1 = __importDefault(require("./utils/logger"));
const sheduleCron_1 = require("./cron/sheduleCron");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configureMiddleware();
        this.connectDatabase();
        this.configureRoutes();
        this.configureErrorHandling();
        this.handleProcessEvents();
        new sheduleCron_1.ScheduleCron();
    }
    configureMiddleware() {
        this.app.use(this.addRequestId);
        this.app.use(this.addResponseTime);
        this.app.use(requestLogger_1.requestLogger);
        this.app.use((0, helmet_1.default)({
            contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
        }));
        this.app.use((0, cors_1.default)({
            origin: config_1.config.corsOrigin,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
        }));
        this.app.use((0, express_mongo_sanitize_1.default)());
        this.app.use((0, hpp_1.default)());
        this.app.use(express_1.default.json({
            limit: '10kb',
            verify: (req, _res, buf) => {
                req.rawBody = buf.toString();
            }
        }));
        this.app.use(express_1.default.urlencoded({
            extended: true,
            limit: '10kb'
        }));
        this.app.use((0, cookie_parser_1.default)());
        if (process.env.NODE_ENV === 'development') {
            this.app.use((0, morgan_1.default)('dev'));
        }
        this.app.use((0, compression_1.default)());
    }
    async connectDatabase() {
        try {
            const conn = await mongoose_1.default.connect(config_1.config.database.url, {
                ...config_1.config.database.options,
                autoIndex: process.env.NODE_ENV === 'development'
            });
            logger_1.default.info('MongoDB Connected Successfully!', {
                database: conn.connection.name,
                host: conn.connection.host,
                port: conn.connection.port
            });
            mongoose_1.default.connection.on('error', (err) => {
                logger_1.default.error('MongoDB connection error:', err);
            });
            mongoose_1.default.connection.on('disconnected', () => {
                logger_1.default.warn('MongoDB disconnected');
            });
            mongoose_1.default.connection.on('reconnected', () => {
                logger_1.default.info('MongoDB reconnected');
            });
        }
        catch (error) {
            logger_1.default.error('Error connecting to MongoDB:', error);
            process.exit(1);
        }
    }
    configureRoutes() {
        this.app.get('/health', (_req, res) => {
            res.status(200).json({
                status: 'success',
                message: 'Server is healthy',
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV
            });
        });
        this.app.use('/api', routes_1.default);
        this.app.all('*', (req, _res, next) => {
            next(new errorHandler_1.AppError(404, `Can't find ${req.originalUrl} on this server!`));
        });
    }
    configureErrorHandling() {
        this.app.use(errorHandler_1.errorHandler);
    }
    handleProcessEvents() {
        process.on('unhandledRejection', (reason) => {
            logger_1.default.error('Unhandled Promise Rejection:', reason);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        });
        process.on('uncaughtException', (error) => {
            logger_1.default.error('Uncaught Exception:', error);
            process.exit(1);
        });
        process.on('SIGTERM', this.gracefulShutdown.bind(this));
        process.on('SIGINT', this.gracefulShutdown.bind(this));
    }
    async gracefulShutdown() {
        logger_1.default.info('Received shutdown signal. Starting graceful shutdown...');
        try {
            await mongoose_1.default.connection.close();
            logger_1.default.info('MongoDB connection closed.');
            process.exit(0);
        }
        catch (error) {
            logger_1.default.error('Error during graceful shutdown:', error);
            process.exit(1);
        }
    }
    addRequestId(req, res, next) {
        const requestId = req.headers['x-request-id'] ||
            `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        req.headers['x-request-id'] = requestId;
        res.setHeader('X-Request-ID', requestId);
        next();
    }
    addResponseTime(req, res, next) {
        const startTime = process.hrtime();
        if (!res.listeners('finish').length) {
            res.once('finish', () => {
                const duration = process.hrtime(startTime);
                const durationMs = (duration[0] * 1000 + duration[1] / 1e6).toFixed(2);
                req.responseTime = durationMs;
                if (!res.headersSent) {
                    res.setHeader('X-Response-Time', `${durationMs}ms`);
                }
            });
        }
        next();
    }
    async start() {
        try {
            const port = config_1.config.port;
            const server = this.app.listen(port, () => {
                logger_1.default.info(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
                logger_1.default.info(`Server URL: http://localhost:${port}`);
            });
            server.on('error', (error) => {
                if (error.code === 'EADDRINUSE') {
                    logger_1.default.error(`Port ${port} is already in use`);
                }
                else {
                    logger_1.default.error('Server error:', error);
                }
                process.exit(1);
            });
        }
        catch (error) {
            logger_1.default.error('Failed to start server:', error);
            process.exit(1);
        }
    }
}
const server = new App();
if (process.env.NODE_ENV !== 'test') {
    server.start().catch(error => {
        logger_1.default.error('Unhandled server error:', error);
        process.exit(1);
    });
}
exports.default = server.app;
//# sourceMappingURL=app.js.map