import { connect, connection } from "mongoose";

export default function initMongo() {
    const dbHost = process.env.DB_HOST || "localhost";
    const dbPort = process.env.DB_PORT || "27017";
    const dbName = process.env.DB_NAME || "aplikasi_konsul";
    const dbUser = process.env.DB_USER;
    const dbPass = process.env.DB_PASS;
    async function run(): Promise<void> {
        if (dbUser !== "") {
            await connect(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`, () => {
                console.log('connected to database');
            });            
        } else {
            await connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, () => {
                console.log('connected to database');
            });
        }
    }
    run().catch(err => console.log(err));
    connection.on('error', console.log)
    connection.on('disconnected', run)
}
