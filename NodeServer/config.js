import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

// Configuration object for the Postgres database
const postgresConfig = {
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DATABASE,
};

if (!postgresConfig.username || !postgresConfig.password || !postgresConfig.host || !postgresConfig.port || !postgresConfig.database) {
    throw new Error('Missing necessary Postgres environment variables');
}

const encodedPassword = encodeURIComponent(postgresConfig.password);

postgresConfig.defaultDatabase = `postgres://${postgresConfig.username}:${encodedPassword}@${postgresConfig.host}:${postgresConfig.port}/postgres`;

const serverPort = process.env.SERVER_PORT 
const dashBoardApiUrl = process.env.DASHBOARD_API_URL
const sailTimerApiUrl = process.env.SAIL_TIMER_API_URL;

if (!dashBoardApiUrl || !sailTimerApiUrl) {
    throw new Error('Missing necessary API URLs');
}

export {
    postgresConfig,
    sailTimerApiUrl,
    serverPort,
    dashBoardApiUrl,
};
