

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { dbConnection } from './src/Database/PostgresSqlDb.js';
import projectRoutes from './src/Database/modals/Project/ProjectRoutes.js';
import componentRoutes from './src/Database/modals/Component/ComponentRoutes.js';
import userRoutes from './src/Database/modals/User/UserRoutes.js';
import geoConfigsRouter from './src/Database/modals/GeoConfig/GeoConfigRoutes.js';
import layerRouter from './src/Database/modals/Layer/LayerRoutes.js';
import propertiesRouter from './src/Database/modals/Properties/PropertiesRouter.js';
import logoConfigRouter from './src/Database/modals/LogoConfig/LogoConfigRouter.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import geoserverRouter from './src/GeoServerRouters/GeoServerRouters.js';
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const app = express();

// Function to get all JS files in a directory
const getJsFiles = (dir) => {
    return fs.readdirSync(dir).reduce((files, file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            return [...files, ...getJsFiles(filePath)];
        }
        if (filePath.endsWith('.js')) {
            files.push(filePath);
        }
        return files;
    }, []);
};

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'App-Builder APIs',
            version: '1.0.0',
            description: 'API documentation for managing application builder ',
        },
        servers: [
            {
                url: 'http://localhost:8080',
            },
        ],
    },
    apis: getJsFiles('./src/Database/modals/'), // Get all .js files from the specified directory
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Database connection function
async function connectToDatabase() {
    try {
        await dbConnection.sync({ force: false });
        console.log('Database synchronized successfully.');
        // Mounting routes after the database connection
        app.use('/', userRoutes);
        app.use('/', projectRoutes);
        app.use('/', componentRoutes);
        app.use('/', geoConfigsRouter);
        app.use('/', layerRouter);
        app.use('/', propertiesRouter);
        app.use('/', logoConfigRouter);
        app.use('/', geoserverRouter);

    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
}

app.get('/start', (req, res) => {
    res.send('<h1>Welcome! The server is running!</h1>');
});

const serverPort = process.env.SERVER_PORT || 8080;

connectToDatabase().then(() => {
    app.listen(serverPort, () => {
        console.log(`App is running on port ${serverPort}`);
        console.log(`Swagger docs are available at http://localhost:${serverPort}/api-docs`);
    });
}).catch(err => {
    console.error('Failed to start the server:', err);
});
