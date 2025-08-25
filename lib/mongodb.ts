import { MongoClient } from "mongodb";

const options = {};

// Extend global type in development
declare global {
    // eslint-disable-next-line no-var
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

export default (function getClientPromise() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error("❌ MONGODB_URI is not set. Add it in Vercel Project Settings → Environment Variables.");
    }

    if (process.env.NODE_ENV === "development") {
        // Reuse client across hot reloads
        if (!global._mongoClientPromise) {
            const client = new MongoClient(uri, options);
            global._mongoClientPromise = client.connect();
        }
        return global._mongoClientPromise;
    } else {
        // In production, create new client once
        const client = new MongoClient(uri, options);
        return client.connect();
    }
})();
