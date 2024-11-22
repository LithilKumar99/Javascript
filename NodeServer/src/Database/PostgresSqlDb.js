import { Sequelize } from 'sequelize';
import { postgresConfig } from '../../config.js';
import { ProjectModel, createProjectModel } from './modals/Project/ProjectModel.js';
import { ComponentModel, createComponentModel } from './modals/Component/ComponentModel.js';
import { UserModel, createUserModel } from './modals/User/UserModel.js';
import { GeoConfigModel, createGeoConfigModel } from './modals/GeoConfig/GeoConfigModel.js';
import { LayerModel, createLayerModel } from './modals/Layer/LayerModel.js';
import { PropertiesModel, createPropertiesModel } from './modals/Properties/PropertiesModel.js'
import { LogoConfigModel, createLogoConfigModel } from './modals/LogoConfig/LogoConfigModel.js';
/*----------------------------------------------------------------
Create a Sequelize instance to connect to the default 'postgres' database
-----------------------------------------------------------------*/
const dbConnection = new Sequelize(postgresConfig.defaultDatabase, {
    logging: false,
});

/*----------------------------------------------------------------
Define a function to connect to the database or create it if it doesn't exist
-----------------------------------------------------------------*/
const checkAndCreateDatabase = async () => {
    try {
        await dbConnection.authenticate();

        const [results] = await dbConnection.query(`SELECT 1 FROM pg_database WHERE datname = '${postgresConfig.database}'`);

        if (results.length === 0) {
            await dbConnection.query(`CREATE DATABASE "${postgresConfig.database}"`);
            console.log(`The ${postgresConfig.database} database was created successfully.`);
        } else {
            console.log(`Successfully connected to the ${postgresConfig.database} database.`);
        }
    } catch (error) {
        console.error(`Failed to create the ${postgresConfig.database} database.`, error);
    }
};

/*----------------------------------------------------------------
Sync the UserModel with the database
-----------------------------------------------------------------*/
const connectingPostgres = async () => {
    try {

        await checkAndCreateDatabase();
        const newConnection = new Sequelize({
            database: postgresConfig.database,
            username: postgresConfig.username,
            password: postgresConfig.password,
            host: postgresConfig.host,
            port: postgresConfig.port,
            dialect: 'postgres',
            logging: false,
        });

        await newConnection.authenticate();
        await createUserModel(newConnection);
        await createProjectModel(newConnection);
        await createComponentModel(newConnection);
        await createGeoConfigModel(newConnection);
        await createLayerModel(newConnection);
        await createPropertiesModel(newConnection);
        await createLogoConfigModel(newConnection);

    } catch (connectError) {
        console.log(connectError);
    }
};

connectingPostgres();

export {
    UserModel,
    ProjectModel,
    ComponentModel,
    GeoConfigModel,
    LayerModel,
    PropertiesModel,
    LogoConfigModel,
    dbConnection
};
