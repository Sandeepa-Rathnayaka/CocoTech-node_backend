import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getFirestore } from "firebase-admin/firestore";

interface FirebaseConfig {
  credential: {
    projectId: string;
    clientEmail: string;
    privateKey: string;
  };
  databaseURL: string;
}

class FirebaseService {
  private static instance: FirebaseService;
  private db: any;
  private rtdb: any;

  private constructor() {
    try {
      const config: FirebaseConfig = {
        credential: {
          projectId: "moisturesens",
          clientEmail:
            "firebase-adminsdk-fbsvc@moisturesens.iam.gserviceaccount.com", // You'll need to get this from your service account
          privateKey:
            "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDS26MYqeSI+ohX\nlau6GFW7cTg2ZBmgjOU8jZK68qfJYFQV8GekLIFi9PXWlebWPXI0duWgCAznYBLf\nGwo7oG5BAFVWCVwHmjwmWS9R8QYaia2bwtVphumtlZ5NidAgy28Q75vqbo58NpE5\nFtly2iAjwJJvJDPIfqWdw2Vcs4vOqdfgqHApn8PnPe7x8hu4lwgK6ms0z+x8K6P1\nn18wRkMHAMK7vtJ8vuXSTskPSqsr0rlYtVO7exA0dRtZukLxBjXQ6zZ9SS7Qnhm5\nNL+fx+A11mMlKZ9lBMl3JeI4gQaudcPQE9Oq2JOJDJZCQ43jNr2/k3yJguVVl7Kt\ny7Y90zslAgMBAAECggEADgZ1+5BklyF/xPOiD8EwORH3paAhSqb67uNfCZHvMlt2\nvFulSSvjEoX6SpYZKJ7yfb+uCzSXelYCa1ZATZigozCc4uaOEvAumA5oMcPqazfe\nyFsi5UYICd4t2jjhRln08hdxM4K73FJ02zgREEamywbM6eYEKI3kAXGbYf/yiLU8\nbmuYYnsoeKycZ78AyDU7NcBOyQBdGcl47ESmPYfMaS5Zz6rQCuaNjdLz2LM1n6Ss\nIVSJnctCyx/FpL/1Ctl+b+HPPXYT+BAxGRmJwiG8xwfUpyBK8jARFeaBZX0aGrgQ\n/H8X8LlK29M7n7OgXvWFVPjar0pK3+Tb0CqqMEG48QKBgQD36df+8ETD7OYw5/AO\nYtar6cXBWRgbazR02IoZXnPBOrw/zTOWPz0m6Ta5MzLu792LvurzKDJiOBQBFC4J\np2SZ57wvhmHanYKrzL9iFsJApAvFXj37ZDqBEM4fVvUuQ4TNpP/C4iRNxdfhR7/l\n+fE5U+RPjSvJYBpQJHqrAyaYewKBgQDZvF5BImiXjHv+zhhKRNBeHY3Sm6OJz4K/\nJj78TqAThdJcDcvyAOPEwtJWfiOUOgmg0l0RLmkz+hFInIJ8xovH/gdhNgQLWN7Z\ne0RiWMFIa+OU9XheR0XWux7oj2rjeAP1kkqJuVzphR1vyn8kNlmzuaNzWtsXykho\nTUUpCBS43wKBgHBVhYn/VSlyLtv6PMxH/P3o77KsrD/AVASeGfVk1w63jpVaZgWu\nogb/pcxFZs7d4YVw/QUxMaNPxcC3ZCT7tJoIZz0hpzVoKc2u+Ql5RowDyVGlYnCG\n+fuBoeSRgod0ELkeCsZDsi+LdkaePFX461UOrmVdknmtEj8+SFc1FkgBAoGAfpB3\nPWdR4t3fabLE/c7YTAzj1otv2XiM6K3DqQfPFuoP6ECAz1BjFYmlmG9EITJHTHtb\na9RNhNAUYd/QHdWPhRYNlh0+5pWnHEYB7yTmXUGRjZHOgQbu+q3Ufpx3Jngp3QJH\nX50m+/rLrKLJmvQY2lbLQw+KEV8dDbv0urAe04MCgYBqBfHCXyx79INgfUSNudzk\nc0N23e3AMoBDIy/Idu1eaVCKjVtILRLrh9S22Fqbil62lISsrM6CwHbgeGxXBSBB\nH19MDjl2senQL3KJdrixNj65xMY+nGMfy/VmgsqTe8WySGZQHzWDcpdQCGjn1GAS\nrYeCmKncbliaG4aDuDrCXQ==\n-----END PRIVATE KEY-----\n", // This should be from your service account JSON file
        },
        databaseURL: "https://moisturesens-default-rtdb.firebaseio.com",
      };

      // Initialize Firebase Admin
      const app = initializeApp({
        credential: cert(config.credential),
        databaseURL: config.databaseURL,
      });

      // Initialize Firestore and Realtime Database
      this.db = getFirestore(app);
      this.rtdb = getDatabase(app);

      console.log("Firebase initialized successfully");
    } catch (error) {
      console.error("Error initializing Firebase:", error);
      throw error;
    }
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  // Map device ID to the correct path in Firebase
  private getDevicePath(deviceId: string): string {
    // Map device IDs to the proper paths in Firebase
    // This mapping depends on your device naming convention
    const deviceMap: Record<string, string> = {
      // Map your device IDs to their paths in the database
      // For example:
      "001": "SoilAnalyzer_001",
      "002": "SoilAnalyzer_002",
      SoilAnalyzer_001: "SoilAnalyzer_001",
      SoilAnalyzer_002: "SoilAnalyzer_002",
    };

    // If no mapping found, try to use the deviceId directly
    return deviceMap[deviceId] || deviceId;
  }

  // Get Soil Moisture Readings - modified to work with your data structure
  public async getSoilMoistureReadings(deviceId: string): Promise<{
    moisture10cm: number;
    moisture20cm: number;
    moisture30cm: number;
    batteryLevel:number;
    timestamp: Date;
  } | null> {
    try {
      // Get the device path based on the device ID
      const devicePath = this.getDevicePath(deviceId);

      // Read from the soil_analyzer/{devicePath}/history path
      const ref = this.rtdb.ref(`soil_analyzer/${devicePath}/history`);
      const snapshot = await ref
        .orderByChild("timestamp")
        .limitToLast(1)
        .once("value");

      if (!snapshot.exists()) {
        console.log(
          `No data found for device ${deviceId} at path soil_analyzer/${devicePath}/history`
        );
        return null;
      }

      // Get the latest entry
      const entries = snapshot.val();
      const timestamps = Object.keys(entries).sort(
        (a, b) => parseInt(b) - parseInt(a)
      );
      const latestTimestamp = timestamps[0];
      const latestData = entries[latestTimestamp];

      return {
        moisture10cm: latestData.sensor_3 || 0,
        moisture20cm: latestData.sensor_2 || 0,
        moisture30cm: latestData.sensor_1 || 0,
        batteryLevel: latestData.battery || 100,
        timestamp: new Date(latestData.timestamp * 1000), // Convert Unix timestamp to Date object
      };
    } catch (error) {
      console.error("Error getting soil moisture readings:", error);
      throw error;
    }
  }

//   // Subscribe to Soil Moisture Updates - modified to work with your data structure
//   public subscribeSoilMoistureUpdates(
//     deviceId: string,
//     callback: (data: any) => void
//   ): void {
//     const devicePath = this.getDevicePath(deviceId);
//     const ref = this.rtdb.ref(`soil_analyzer/${devicePath}/history`);

//     ref.on("child_added", (snapshot: any) => {
//       const data = snapshot.val();
//       // Convert from sensor_1, sensor_2, sensor_3 format to moisture10cm, moisture20cm, moisture30cm
//       callback({
//         moisture10cm: data.sensor_1 || 0,
//         moisture20cm: data.sensor_2 || 0,
//         moisture30cm: data.sensor_3 || 0,
//         timestamp: new Date(data.timestamp * 1000),
//       });
//     });
//   }

//   // Store Device Reading History
//   public async storeReadingHistory(
//     deviceId: string,
//     reading: any
//   ): Promise<void> {
//     try {
//       await this.db
//         .collection("deviceReadings")
//         .doc(deviceId)
//         .collection("history")
//         .add({
//           ...reading,
//           timestamp: new Date(),
//         });
//     } catch (error) {
//       console.error("Error storing reading history:", error);
//       throw error;
//     }
//   }

//   // Get Device Reading History
//   public async getReadingHistory(
//     deviceId: string,
//     days: number = 7
//   ): Promise<any[]> {
//     try {
//       const startDate = new Date();
//       startDate.setDate(startDate.getDate() - days);

//       const snapshot = await this.db
//         .collection("deviceReadings")
//         .doc(deviceId)
//         .collection("history")
//         .where("timestamp", ">=", startDate)
//         .orderBy("timestamp", "desc")
//         .get();

//       return snapshot.docs.map((doc: { id: any; data: () => any }) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//     } catch (error) {
//       console.error("Error getting reading history:", error);
//       throw error;
//     }
//   }

//   // Get all saved soil analyzer devices
//   public async getAllSoilAnalyzerDevices(): Promise<string[]> {
//     try {
//       const ref = this.rtdb.ref("soil_analyzer");
//       const snapshot = await ref.once("value");

//       if (!snapshot.exists()) {
//         return [];
//       }

//       return Object.keys(snapshot.val());
//     } catch (error) {
//       console.error("Error getting soil analyzer devices:", error);
//       throw error;
//     }
//   }

  // For Food Moisture devices
  public async getFoodMoistureReadings(deviceId: string): Promise<{
    moistureLevel: number;
    timestamp: Date;
  } | null> {
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

      // Get the latest entry
      const entries = snapshot.val();
      const timestamps = Object.keys(entries).sort(
        (a, b) => parseInt(b) - parseInt(a)
      );
      const latestTimestamp = timestamps[0];
      const latestData = entries[latestTimestamp];

      return {
        moistureLevel: latestData.sensor_1 || 0,
        timestamp: new Date(latestData.timestamp * 1000),
      };
    } catch (error) {
      console.error("Error getting food moisture readings:", error);
      throw error;
    }
  }
}

export const firebaseService = FirebaseService.getInstance();
