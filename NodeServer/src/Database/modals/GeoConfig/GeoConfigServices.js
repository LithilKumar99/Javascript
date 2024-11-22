import { GeoConfigModel } from './GeoConfigModel.js';

const createGeoConfig = async (geoConfig) => {
    try {
        return await GeoConfigModel.create(geoConfig);
    } catch (error) {
        throw new Error('Could not create GeoConfig: ' + error.message);
    }
};

const getAllGeoConfigs = async () => {
    try {
        return await GeoConfigModel.findAll();
    } catch (error) {
        throw new Error('Could not fetch GeoConfigs: ' + error.message);
    }
};

const updateGeoConfig = async (id, newData) => {
    try {
        const geoConfig = await GeoConfigModel.findByPk(id);
        if (!geoConfig) {
            throw new Error('GeoConfig not found');
        }
        return await geoConfig.update(newData);
    } catch (error) {
        throw new Error('Could not update GeoConfig: ' + error.message);
    }
};

const deleteGeoConfig = async (id) => {
    try {
        const geoConfig = await GeoConfigModel.findByPk(id);
        if (!geoConfig) {
            throw new Error('GeoConfig not found');
        }
        return await geoConfig.destroy();
    } catch (error) {
        throw new Error('Could not delete GeoConfig: ' + error.message);
    }
};

export {
    createGeoConfig,
    getAllGeoConfigs,
    updateGeoConfig,
    deleteGeoConfig
};
