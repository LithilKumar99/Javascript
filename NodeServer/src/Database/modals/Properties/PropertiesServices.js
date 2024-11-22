import { PropertiesModel } from './PropertiesModel.js';
import { Sequelize } from 'sequelize';

const createProperty = async (propertyData) => {
    try {
        const property = await PropertiesModel.create(propertyData);
        return property;
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            console.log('properties with the same projectId already exists.');
            return null;
        }
        throw new Error('Could not create property');
    }
};

const getPropertyByProjectId = async (projectId) => {
    try {
        const properties = await PropertiesModel.findAll({
            where: {
                projectId: projectId
            }
        });
        return properties;
    } catch (error) {
        throw new Error('Could not fetch properties');
    }
};

const updatePropertyByProjectId = async (projectId, newData) => {
    try {
        const [updatedRowsCount] = await PropertiesModel.update(newData, {
            where: {
                projectId: projectId
            }
        });
        return updatedRowsCount;
    } catch (error) {
        throw new Error('Could not update properties');
    }
};

export { createProperty, getPropertyByProjectId, updatePropertyByProjectId };
