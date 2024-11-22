import express from 'express';
import {
    createComponent,
    getComponentsByProjectId,
    deleteComponentByName,
} from './ComponentService.js';

const componentRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Components
 *     description: API for managing components
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Component:
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
 * /component:
 *   post:
 *     summary: Create a new component
 *     tags: [Components]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Component'
 *     responses:
 *       200:
 *         description: Component created
 */
componentRouter.post('/component', async (req, res) => {
    try {
        const component = await createComponent(req.body);
        res.status(200).json(component);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /components/{projectId}:
 *   get:
 *     summary: Retrieve components by project ID
 *     tags: [Components]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         description: Numeric ID of the project to retrieve components for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of components for the specified project
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Component'
 */
componentRouter.get('/components/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        const components = await getComponentsByProjectId(projectId);
        res.json(components);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /components/{name}:
 *   delete:
 *     summary: Delete a component by name
 *     tags: [Components]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: Name of the component to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Component deleted successfully
 *       404:
 *         description: Component not found
 */
componentRouter.delete('/components/:name', async (req, res) => {
    try {
        await deleteComponentByName(req.params.name);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default componentRouter;
