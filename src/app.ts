import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import routes from './routes';
import { config } from './config';
import { errorHandler, AppError } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import logger from './utils/logger';
import { ScheduleCron } from './cron/sheduleCron';

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.configureMiddleware();
        this.connectDatabase();
        this.configureRoutes();
        this.configureErrorHandling();
        this.handleProcessEvents();
        new ScheduleCron();
    }

    private configureMiddleware(): void {
        // Request ID and Logging middleware (should be first)
        this.app.use(this.addRequestId);
        this.app.use(this.addResponseTime);
        this.app.use(requestLogger);

        //comment check


        // Security middleware
        this.app.use(helmet({
            contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
        }));
        
        this.app.use(cors({
            origin: config.corsOrigin,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
        }));
        
        this.app.use(mongoSanitize());
        this.app.use(hpp());

        // Request parsing
        this.app.use(express.json({ 
            limit: '10kb',
            verify: (req: Request, _res: Response, buf: Buffer) => {
                (req as any).rawBody = buf.toString();
            }
        }));
        
        this.app.use(express.urlencoded({ 
            extended: true, 
            limit: '10kb' 
        }));
        
        this.app.use(cookieParser());

        // Development logging
        if (process.env.NODE_ENV === 'development') {
            this.app.use(morgan('dev'));
        }

        // Compression
        this.app.use(compression());
    }

    private async connectDatabase(): Promise<void> {
        try {
            const conn = await mongoose.connect(config.database.url, {
                ...config.database.options,
                autoIndex: process.env.NODE_ENV === 'development'
            });

            logger.info('MongoDB Connected Successfully!', {
                database: conn.connection.name,
                host: conn.connection.host,
                port: conn.connection.port
            });

            mongoose.connection.on('error', (err) => {
                logger.error('MongoDB connection error:', err);
            });

            mongoose.connection.on('disconnected', () => {
                logger.warn('MongoDB disconnected');
            });

            mongoose.connection.on('reconnected', () => {
                logger.info('MongoDB reconnected');
            });

        } catch (error) {
            logger.error('Error connecting to MongoDB:', error);
            process.exit(1);
        }
    }

    private configureRoutes(): void {
        // Health check
        this.app.get('/health', (_req: Request, res: Response) => {
            res.status(200).json({
                status: 'success',
                message: 'Server is healthy',
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV
            });
        });

        // API routes
        this.app.use('/api', routes);

        // Handle undefined routes
        this.app.all('*', (req: Request, _res: Response, next: NextFunction) => {
            next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
        });
    }

    private configureErrorHandling(): void {
        this.app.use(errorHandler);
    }

    private handleProcessEvents(): void {
        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason: Error) => {
            logger.error('Unhandled Promise Rejection:', reason);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        });

        // Handle uncaught exceptions
        process.on('uncaughtException', (error: Error) => {
            logger.error('Uncaught Exception:', error);
            process.exit(1);
        });

        // Handle cleanup on shutdown
        process.on('SIGTERM', this.gracefulShutdown.bind(this));
        process.on('SIGINT', this.gracefulShutdown.bind(this));
    }

    private async gracefulShutdown(): Promise<void> {
        logger.info('Received shutdown signal. Starting graceful shutdown...');
        
        try {
            await mongoose.connection.close();
            logger.info('MongoDB connection closed.');
            process.exit(0);
        } catch (error) {
            logger.error('Error during graceful shutdown:', error);
            process.exit(1);
        }
    }

    private addRequestId(req: Request, res: Response, next: NextFunction): void {
        const requestId = req.headers['x-request-id'] || 
            `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        req.headers['x-request-id'] = requestId;
        res.setHeader('X-Request-ID', requestId);
        next();
    }

    private addResponseTime(req: Request, res: Response, next: NextFunction): void {
        const startTime = process.hrtime();

        // Only add listener if it hasn't been added yet
        if (!res.listeners('finish').length) {
            res.once('finish', () => {
                const duration = process.hrtime(startTime);
                const durationMs = (duration[0] * 1000 + duration[1] / 1e6).toFixed(2);
                
                // Add duration to response object for logging
                (req as any).responseTime = durationMs;
                
                // Only try to set header if headers haven't been sent
                if (!res.headersSent) {
                    res.setHeader('X-Response-Time', `${durationMs}ms`);
                }
            });
        }

        next();
    }

    public async start(): Promise<void> {
        try {
            const port = config.port;
            const server = this.app.listen(port, () => {
                logger.info(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
                logger.info(`Server URL: http://localhost:${port}`);
            });

            // Handle server-specific errors
            server.on('error', (error: NodeJS.ErrnoException) => {
                if (error.code === 'EADDRINUSE') {
                    logger.error(`Port ${port} is already in use`);
                } else {
                    logger.error('Server error:', error);
                }
                process.exit(1);
            });

        } catch (error) {
            logger.error('Failed to start server:', error);
            process.exit(1);
        }
    }
}

const server = new App();

if (process.env.NODE_ENV !== 'test') {
    server.start().catch(error => {
        logger.error('Unhandled server error:', error);
        process.exit(1);
    });
}

export default server.app;