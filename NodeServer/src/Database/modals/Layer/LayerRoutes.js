import express from 'express';
import {
    createLayer,
    deleteLayer,
    getAllLayers,
    getLastInsertedIndexes,
    deleteLayerByProjectAndLayer,
    getAllLayersByProjectId,
    getLayersByProjectId,
} from './LayerServices.js';

const layerRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Layers
 *     description: API for managing layers
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Layer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         projectId:
 *           type: integer
 */

/**
 * @swagger
 * /layer:
 *   post:
 *     summary: Create a new layer
 *     tags: [Layers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Layer'
 *     responses:
 *       200:
 *         description: Layer created
 */
layerRouter.post('/layer', async (req, res) => {
    try {
        const newLayer = await createLayer(req.body);
        res.json(newLayer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /layer/{id}:
 *   delete:
 *     summary: Delete a layer by ID
 *     tags: [Layers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the layer to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Layer deleted successfully
 */
layerRouter.delete('/layer/:id', async (req, res) => {
    try {
        await deleteLayer(req.params.id);
        res.json({ message: 'Layer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /layers:
 *   get:
 *     summary: Retrieve all layers
 *     tags: [Layers]
 *     responses:
 *       200:
 *         description: A list of layers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Layer'
 */
layerRouter.get('/layers', async (req, res) => {
    try {
        const layers = await getAllLayers();
        res.json(layers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /layer/lastIndex/{projectId}:
 *   get:
 *     summary: Get last inserted indexes for a project
 *     tags: [Layers]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: Numeric ID of the project
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Last inserted indexes retrieved
 */
layerRouter.get('/layer/lastIndex/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        const lastInsertedIndexes = await getLastInsertedIndexes(projectId);
        res.json(lastInsertedIndexes);
    } catch (error) {
        console.error("Error retrieving last inserted indexes:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * @swagger
 * /layer/{projectId}/{layer}:
 *   delete:
 *     summary: Delete a layer by project ID and layer name
 *     tags: [Layers]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: Numeric ID of the project
 *         schema:
 *           type: integer
 *       - in: path
 *         name: layer
 *         required: true
 *         description: Name of the layer to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Layer deleted successfully
 */
layerRouter.delete('/layer/:projectId/:layer', async (req, res) => {
    const { projectId, layer } = req.params;
    try {
        await deleteLayerByProjectAndLayer(projectId, layer);
        res.status(200).json({ message: 'Layer deleted successfully' });
    } catch (error) {
        console.error("Error deleting layer:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * @swagger
 * /layers/{projectId}:
 *   get:
 *     summary: Retrieve layers by project ID
 *     tags: [Layers]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: Numeric ID of the project to retrieve layers for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of layers for the specified project
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Layer'
 */
layerRouter.get('/layers/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        const layers = await getAllLayersByProjectId(projectId);
        res.status(200).json(layers);
    } catch (error) {
        console.error("Error getting layers by projectId:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * @swagger
 * /getlayers/{projectId}:
 *   get:
 *     summary: Retrieve layers by project ID (alternative endpoint)
 *     tags: [Layers]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: Numeric ID of the project to retrieve layers for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of layers for the specified project
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Layer'
 */
layerRouter.get('/getlayers/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        const layers = await getLayersByProjectId(projectId);
        res.status(200).json(layers);
    } catch (error) {
        console.error("Error getting layers by projectId:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default layerRouter;
