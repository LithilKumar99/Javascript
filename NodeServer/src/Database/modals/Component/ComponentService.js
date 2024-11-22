import { ComponentModel } from './ComponentModel.js';

const createComponent = async (componentData) => {
    try {
        const component = await ComponentModel.create(componentData);
        return component;
    } catch (error) {
        throw new Error(`Error creating component: ${error.message}`);
    }
};

const getComponentsByProjectId = async (projectId) => {
    try {
        const components = await ComponentModel.findAll({ where: { projectId } });
        return components;
    } catch (error) {
        throw new Error(`Failed to fetch components: ${error.message}`);
    }
};

const deleteComponentByName = async (componentName) => {
    try {
        const deletedComponent = await ComponentModel.destroy({
            where: { component: componentName }
        });
        if (deletedComponent === 0) {
            throw new Error('Component not found');
        }
    } catch (error) {
        throw error;
    }
};

export {
    createComponent,
    getComponentsByProjectId,
    deleteComponentByName
};
