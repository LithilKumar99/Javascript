import { LayerModel } from './LayerModel.js';
// Create a new layer
const createLayer = async (layerData) => {
    try {
        const newLayer = await LayerModel.create(layerData);
        return newLayer;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Delete a layer
const deleteLayer = async (id) => {
    try {
        const deletedRowCount = await LayerModel.destroy({
            where: { id },
        });
        if (deletedRowCount === 0) {
            throw new Error('Layer not found or not deleted');
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

// Get a single layer by ID
const getLayerById = async (id) => {
    try {
        const layer = await LayerModel.findByPk(id);
        if (!layer) {
            throw new Error('Layer not found');
        }
        return layer;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Get all layers
const getAllLayers = async () => {
    try {
        const layers = await LayerModel.findAll();
        return layers;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getLastInsertedIndexes = async (projectId) => {
    try {
        const lastInsertedIndexes = await LayerModel.findAll({
            attributes: ['index'],
            where: { projectId },
            order: [['id', 'DESC']],
            limit: 1
        });
        return lastInsertedIndexes;
    } catch (error) {
        throw new Error("Error fetching last inserted indexes from database");
    }
};

const deleteLayerByProjectAndLayer = async (projectId, layer) => {
    try {
        await LayerModel.destroy({
            where: {
                projectId,
                layer
            }
        });
    } catch (error) {
        throw new Error("Error deleting layer from database");
    }
};

const getAllLayersByProjectId = async (projectId) => {
    try {
        const layers = await LayerModel.findAll({
            where: { projectId }
        });
        return layers;
    } catch (error) {
        throw error;
    }
};

const getLayersByProjectId = async (projectId) => {
    try {
        const layers = await LayerModel.findAll({
            attributes: ['url', 'workspace', 'layer'],
            where: { projectId }
        });
        return layers;
    } catch (error) {
        throw error;
    }
};

export {
    createLayer,
    deleteLayer,
    getLayerById,
    getAllLayers,
    getLastInsertedIndexes,
    deleteLayerByProjectAndLayer,
    getAllLayersByProjectId,
    getLayersByProjectId
};
