"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseService = void 0;
const app_1 = require("firebase-admin/app");
const database_1 = require("firebase-admin/database");
const firestore_1 = require("firebase-admin/firestore");
class FirebaseService {
    constructor() {
        try {
            const config = {
                credential: {
                    projectId: "moisturesens",
                    clientEmail: "firebase-adminsdk-fbsvc@moisturesens.iam.gserviceaccount.com",
                    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDS26MYqeSI+ohX\nlau6GFW7cTg2ZBmgjOU8jZK68qfJYFQV8GekLIFi9PXWlebWPXI0duWgCAznYBLf\nGwo7oG5BAFVWCVwHmjwmWS9R8QYaia2bwtVphumtlZ5NidAgy28Q75vqbo58NpE5\nFtly2iAjwJJvJDPIfqWdw2Vcs4vOqdfgqHApn8PnPe7x8hu4lwgK6ms0z+x8K6P1\nn18wRkMHAMK7vtJ8vuXSTskPSqsr0rlYtVO7exA0dRtZukLxBjXQ6zZ9SS7Qnhm5\nNL+fx+A11mMlKZ9lBMl3JeI4gQaudcPQE9Oq2JOJDJZCQ43jNr2/k3yJguVVl7Kt\ny7Y90zslAgMBAAECggEADgZ1+5BklyF/xPOiD8EwORH3paAhSqb67uNfCZHvMlt2\nvFulSSvjEoX6SpYZKJ7yfb+uCzSXelYCa1ZATZigozCc4uaOEvAumA5oMcPqazfe\nyFsi5UYICd4t2jjhRln08hdxM4K73FJ02zgREEamywbM6eYEKI3kAXGbYf/yiLU8\nbmuYYnsoeKycZ78AyDU7NcBOyQBdGcl47ESmPYfMaS5Zz6rQCuaNjdLz2LM1n6Ss\nIVSJnctCyx/FpL/1Ctl+b+HPPXYT+BAxGRmJwiG8xwfUpyBK8jARFeaBZX0aGrgQ\n/H8X8LlK29M7n7OgXvWFVPjar0pK3+Tb0CqqMEG48QKBgQD36df+8ETD7OYw5/AO\nYtar6cXBWRgbazR02IoZXnPBOrw/zTOWPz0m6Ta5MzLu792LvurzKDJiOBQBFC4J\np2SZ57wvhmHanYKrzL9iFsJApAvFXj37ZDqBEM4fVvUuQ4TNpP/C4iRNxdfhR7/l\n+fE5U+RPjSvJYBpQJHqrAyaYewKBgQDZvF5BImiXjHv+zhhKRNBeHY3Sm6OJz4K/\nJj78TqAThdJcDcvyAOPEwtJWfiOUOgmg0l0RLmkz+hFInIJ8xovH/gdhNgQLWN7Z\ne0RiWMFIa+OU9XheR0XWux7oj2rjeAP1kkqJuVzphR1vyn8kNlmzuaNzWtsXykho\nTUUpCBS43wKBgHBVhYn/VSlyLtv6PMxH/P3o77KsrD/AVASeGfVk1w63jpVaZgWu\nogb/pcxFZs7d4YVw/QUxMaNPxcC3ZCT7tJoIZz0hpzVoKc2u+Ql5RowDyVGlYnCG\n+fuBoeSRgod0ELkeCsZDsi+LdkaePFX461UOrmVdknmtEj8+SFc1FkgBAoGAfpB3\nPWdR4t3fabLE/c7YTAzj1otv2XiM6K3DqQfPFuoP6ECAz1BjFYmlmG9EITJHTHtb\na9RNhNAUYd/QHdWPhRYNlh0+5pWnHEYB7yTmXUGRjZHOgQbu+q3Ufpx3Jngp3QJH\nX50m+/rLrKLJmvQY2lbLQw+KEV8dDbv0urAe04MCgYBqBfHCXyx79INgfUSNudzk\nc0N23e3AMoBDIy/Idu1eaVCKjVtILRLrh9S22Fqbil62lISsrM6CwHbgeGxXBSBB\nH19MDjl2senQL3KJdrixNj65xMY+nGMfy/VmgsqTe8WySGZQHzWDcpdQCGjn1GAS\nrYeCmKncbliaG4aDuDrCXQ==\n-----END PRIVATE KEY-----\n",
                },
                databaseURL: "https://moisturesens-default-rtdb.firebaseio.com",
            };
            const app = (0, app_1.initializeApp)({
                credential: (0, app_1.cert)(config.credential),
                databaseURL: config.databaseURL,
            });
            this.db = (0, firestore_1.getFirestore)(app);
            this.rtdb = (0, database_1.getDatabase)(app);
            console.log("Firebase initialized successfully");
        }
        catch (error) {
            console.error("Error initializing Firebase:", error);
            throw error;
        }
    }
    static getInstance() {
        if (!FirebaseService.instance) {
            FirebaseService.instance = new FirebaseService();
        }
        return FirebaseService.instance;
    }
    getDevicePath(deviceId) {
        const deviceMap = {
            "001": "SoilAnalyzer_001",
            "002": "SoilAnalyzer_002",
            SoilAnalyzer_001: "SoilAnalyzer_001",
            SoilAnalyzer_002: "SoilAnalyzer_002",
        };
        return deviceMap[deviceId] || deviceId;
    }
    async getSoilMoistureReadings(deviceId) {
        try {
            const devicePath = this.getDevicePath(deviceId);
            const ref = this.rtdb.ref(`soil_analyzer/${devicePath}/history`);
            const snapshot = await ref
                .orderByChild("timestamp")
                .limitToLast(1)
                .once("value");
            if (!snapshot.exists()) {
                console.log(`No data found for device ${deviceId} at path soil_analyzer/${devicePath}/history`);
                return null;
            }
            const entries = snapshot.val();
            const timestamps = Object.keys(entries).sort((a, b) => parseInt(b) - parseInt(a));
            const latestTimestamp = timestamps[0];
            const latestData = entries[latestTimestamp];
            return {
                moisture10cm: latestData.sensor_3 || 0,
                moisture20cm: latestData.sensor_2 || 0,
                moisture30cm: latestData.sensor_1 || 0,
                batteryLevel: latestData.battery || 100,
                timestamp: new Date(latestData.timestamp * 1000),
            };
        }
        catch (error) {
            console.error("Error getting soil moisture readings:", error);
            throw error;
        }
    }
    async getFoodMoistureReadings(deviceId) {
        try {
            const devicePath = deviceId.startsWith("Food_Moisture_")
                ? deviceId
                : `Food_Moisture_${deviceId}`;
            const ref = this.rtdb.ref(`soil_analyzer/${devicePath}/history`);
            const snapshot = await ref
                .orderByChild("timestamp")
                .limitToLast(1)
                .once("value");
            if (!snapshot.exists()) {
                return null;
            }
            const entries = snapshot.val();
            const timestamps = Object.keys(entries).sort((a, b) => parseInt(b) - parseInt(a));
            const latestTimestamp = timestamps[0];
            const latestData = entries[latestTimestamp];
            return {
                moistureLevel: latestData.sensor_1 || 0,
                timestamp: new Date(latestData.timestamp * 1000),
            };
        }
        catch (error) {
            console.error("Error getting food moisture readings:", error);
            throw error;
        }
    }
}
exports.firebaseService = FirebaseService.getInstance();
//# sourceMappingURL=firebase.js.map