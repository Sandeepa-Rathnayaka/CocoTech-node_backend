"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("./index");
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(index_1.config.database.url, index_1.config.database.options);
        console.log('\x1b[36m%s\x1b[0m', '🌿 MongoDB Connected Successfully!');
        console.log('\x1b[33m%s\x1b[0m', `📦 Database: ${conn.connection.name}`);
        console.log('\x1b[32m%s\x1b[0m', `🚀 Host: ${conn.connection.host}`);
        console.log('\x1b[35m%s\x1b[0m', `⚡ Port: ${conn.connection.port}`);
        mongoose_1.default.connection.on('error', (err) => {
            console.error('\x1b[31m%s\x1b[0m', '❌ MongoDB connection error:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('\x1b[31m%s\x1b[0m', '💔 MongoDB disconnected');
        });
        mongoose_1.default.connection.on('reconnected', () => {
            console.log('\x1b[32m%s\x1b[0m', '💚 MongoDB reconnected');
        });
    }
    catch (error) {
        console.error('\x1b[31m%s\x1b[0m', '❌ Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=database.js.map