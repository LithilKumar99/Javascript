import express from 'express';
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getProjectIdByName,
} from './ProjectService.js';

const projectRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Projects
 *     description: API for managing projects
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

/**
 * @swagger
 * /project:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Project created
 */
projectRouter.post('/project', async (req, res) => {
    try {
        const project = await createProject(req.body);
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Retrieve all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: A list of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
projectRouter.get('/projects', async (req, res) => {
    try {
        const projects = await getAllProjects();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Retrieve a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the project to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 */
projectRouter.get('/projects/:id', async (req, res) => {
    try {
        const project = await getProjectById(req.params.id);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
        } else {
            res.status(200).json(project);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the project to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Project updated
 *       404:
 *         description: Project not found
 */
projectRouter.put('/projects/:id', async (req, res) => {
    try {
        const project = await updateProject(req.params.id, req.body);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the project to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 */
projectRouter.delete('/projects/:id', async (req, res) => {
    try {
        const project = await getProjectById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        await deleteProject(req.params.id);
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /projects/name/{name}:
 *   get:
 *     summary: Get a project ID by name
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: Name of the project to search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project ID retrieved
 *       404:
 *         description: Project not found
 */
projectRouter.get('/projects/name/:name', async (req, res) => {
    const projectName = req.params.name;
    try {
        const projectId = await getProjectIdByName(projectName);
        if (projectId) {
            res.status(200).json({ id: projectId });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        console.error("Error retrieving project ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default projectRouter;
