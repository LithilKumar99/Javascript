import { LogoConfigModel } from './LogoConfigModel.js';

const createLogoConfig = async (projectId, image) => {
    try {
        const existingConfig = await LogoConfigModel.findOne({ where: { projectId } });

        if (existingConfig) {
            throw new Error(`Logo configuration for project ${projectId} already exists.`);
        }

        const newConfig = await LogoConfigModel.create({ projectId, image: image });
        return newConfig;
    } catch (error) {
        console.error(`Error creating logo configuration for project ${projectId}:`, error);
        throw error;
    }
};

const getLogoConfig = async (projectId) => {
    try {
        const config = await LogoConfigModel.findOne({ where: { projectId } });

        if (!config) {
            throw new Error(`No logo configuration found for project ${projectId}.`);
        }

        return config;
    } catch (error) {
        console.error(`Error fetching logo configuration for project ${projectId}:`, error);
        throw error;
    }
};

const deleteLogoConfig = async (projectId) => {
    try {
        const config = await getLogoConfig(projectId);
        await config.destroy();
        return { message: `Logo configuration for project ${projectId} deleted successfully.` };
    } catch (error) {
        console.error(`Error deleting logo configuration for project ${projectId}:`, error);
        throw error;
    }
};

const updateLogoConfig = async (projectId, newImage) => {
    try {
        const config = await getLogoConfig(projectId);
        config.image = newImage;
        await config.save();
        return config;
    } catch (error) {
        console.error(`Error updating logo configuration for project ${projectId}:`, error);
        throw error;
    }
};

export { createLogoConfig, getLogoConfig, updateLogoConfig, deleteLogoConfig };
