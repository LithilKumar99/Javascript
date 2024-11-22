import express from 'express';
import { createGeoConfig, getAllGeoConfigs, updateGeoConfig, deleteGeoConfig } from './GeoConfigServices.js';

const geoConfigsRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: GeoConfig
 *     description: API for managing geographic configurations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     GeoConfig:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         settings:
 *           type: object
 */

/**
 * @swagger
 * /geoConfig:
 *   post:
 *     summary: Create a new GeoConfig
 *     tags: [GeoConfig]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GeoConfig'
 *     responses:
 *       200:
 *         description: GeoConfig created
 */
geoConfigsRouter.post('/geoConfig', async (req, res) => {
    try {
        const geoConfig = req.body;
        const createdGeoConfig = await createGeoConfig(geoConfig);
        res.status(200).json(createdGeoConfig);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /geoConfigs:
 *   get:
 *     summary: Retrieve all GeoConfigs
 *     tags: [GeoConfig]
 *     responses:
 *       200:
 *         description: A list of GeoConfigs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GeoConfig'
 */
geoConfigsRouter.get('/geoConfigs', async (req, res) => {
    try {
        const geoConfigs = await getAllGeoConfigs();
        res.status(200).json(geoConfigs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /geoConfigs/{id}:
 *   put:
 *     summary: Update a GeoConfig by ID
 *     tags: [GeoConfig]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the GeoConfig to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GeoConfig'
 *     responses:
 *       200:
 *         description: GeoConfig updated
 */
geoConfigsRouter.put('/geoConfigs/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedGeoConfig = await updateGeoConfig(id, req.body);
        res.status(200).json(updatedGeoConfig);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /geoConfigs/{id}:
 *   delete:
 *     summary: Delete a GeoConfig by ID
 *     tags: [GeoConfig]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the GeoConfig to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: GeoConfig deleted successfully
 */
geoConfigsRouter.delete('/geoConfigs/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await deleteGeoConfig(id);
        res.status(200).json({ message: 'GeoConfig deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default geoConfigsRouter;
