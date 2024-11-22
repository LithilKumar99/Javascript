import express from 'express';
import {
    createLogoConfig,
    getLogoConfig,
    updateLogoConfig,
    deleteLogoConfig,
} from './LogoConfigService.js';

const logoConfigRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Logo Config
 *     description: API for managing logo configurations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LogoConfig:
 *       type: object
 *       properties:
 *         projectId:
 *           type: integer
 *         image:
 *           type: string
 */

/**
 * @swagger
 * /logo:
 *   post:
 *     summary: Create a new logo configuration
 *     tags: [Logo Config]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogoConfig'
 *     responses:
 *       201:
 *         description: Logo configuration created
 */
logoConfigRouter.post('/logo', async (req, res, next) => {
    const { projectId, image } = req.body;
    try {
        const newConfig = await createLogoConfig(projectId, image);
        res.status(201).json(newConfig);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /logo/{projectId}:
 *   get:
 *     summary: Retrieve a logo configuration by project ID
 *     tags: [Logo Config]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: Numeric ID of the project
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Logo configuration retrieved
 */
logoConfigRouter.get('/logo/:projectId', async (req, res, next) => {
    const { projectId } = req.params;
    try {
        const config = await getLogoConfig(projectId);
        res.status(200).json(config);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /logo/{projectId}:
 *   put:
 *     summary: Update a logo configuration by project ID
 *     tags: [Logo Config]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: Numeric ID of the project
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogoConfig'
 *     responses:
 *       200:
 *         description: Logo configuration updated
 */
logoConfigRouter.put('/logo/:projectId', async (req, res, next) => {
    const { projectId } = req.params;
    const { image } = req.body;
    try {
        const updatedConfig = await updateLogoConfig(projectId, image);
        res.status(200).json(updatedConfig);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /logo/{projectId}:
 *   delete:
 *     summary: Delete a logo configuration by project ID
 *     tags: [Logo Config]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: Numeric ID of the project
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Logo configuration deleted
 */
logoConfigRouter.delete('/logo/:projectId', async (req, res, next) => {
    const { projectId } = req.params;
    try {
        const message = await deleteLogoConfig(projectId);
        res.status(200).json(message);
    } catch (error) {
        next(error);
    }
});

export default logoConfigRouter;
