import express from 'express';
import {
    createProperty,
    getPropertyByProjectId,
    updatePropertyByProjectId,
} from './PropertiesServices.js';

const propertiesRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Properties
 *     description: API for managing properties related to projects
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Property:
 *       type: object
 *       properties:
 *         projectId:
 *           type: integer
 *         name:
 *           type: string
 *         value:
 *           type: string
 */

/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Create a new property
 *     tags: [Properties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Property'
 *     responses:
 *       200:
 *         description: Property created
 */
propertiesRouter.post('/properties', async (req, res) => {
    try {
        const property = await createProperty(req.body);
        res.status(201).json(property);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/**
 * @swagger
 * /properties/{projectId}:
 *   get:
 *     summary: Retrieve properties by project ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: Numeric ID of the project
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of properties for the specified project
 */
propertiesRouter.get('/properties/:projectId', async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const properties = await getPropertyByProjectId(projectId);
        res.status(200).json(properties);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/**
 * @swagger
 * /properties/{projectId}:
 *   put:
 *     summary: Update properties by project ID
 *     tags: [Properties]
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
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Properties updated
 */
propertiesRouter.put('/properties/:projectId', async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const newData = req.body;
        const updatedRowsCount = await updatePropertyByProjectId(projectId, newData);
        res.status(200).send(`${updatedRowsCount} properties updated`);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

export default propertiesRouter;
