// src/config/database.ts
import mongoose from 'mongoose';
import { config } from './index';

const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(config.database.url, config.database.options);
        
        console.log('\x1b[36m%s\x1b[0m', '🌿 MongoDB Connected Successfully!');
        console.log('\x1b[33m%s\x1b[0m', `📦 Database: ${conn.connection.name}`);
        console.log('\x1b[32m%s\x1b[0m', `🚀 Host: ${conn.connection.host}`);
        console.log('\x1b[35m%s\x1b[0m', `⚡ Port: ${conn.connection.port}`);

        // Listen for connection errors after initial connection
        mongoose.connection.on('error', (err) => {
            console.error('\x1b[31m%s\x1b[0m', '❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('\x1b[31m%s\x1b[0m', '💔 MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('\x1b[32m%s\x1b[0m', '💚 MongoDB reconnected');
        });

    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', '❌ Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB;