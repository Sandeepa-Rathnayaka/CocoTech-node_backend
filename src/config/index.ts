import { ConnectOptions } from 'mongoose';

interface DatabaseConfig {
    url: string;
    options: ConnectOptions;
}

interface JWTConfig {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
}

interface Config {
    port: number;
    corsOrigin: string;
    database: DatabaseConfig;
    jwt: JWTConfig;
}

export const config: Config = {
    port: Number(process.env.PORT) || 7000,
    corsOrigin: process.env.CORS_ORIGIN || '*',
    database: {
        url: 'mongodb+srv://sadeepa:sadeepa123@studentmanagement.in6etp1.mongodb.net/hello?retryWrites=true&w=majority',
        options: {
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
        } as ConnectOptions
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    }
};