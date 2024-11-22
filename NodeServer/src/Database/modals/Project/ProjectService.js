import { ProjectModel } from './ProjectModel.js';
import { ComponentModel } from '../Component/ComponentModel.js';
import { LayerModel } from '../Layer/LayerModel.js';
import { PropertiesModel } from '../Properties/PropertiesModel.js';
import { LogoConfigModel } from '../LogoConfig/LogoConfigModel.js';

const createProject = async (projectData) => {
    try {
        const project = await ProjectModel.create(projectData);
        return project;
    } catch (error) {
        throw new Error(`Error creating project: ${error.message}`);
    }
};

const getAllProjects = async () => {
    try {
        const projects = await ProjectModel.findAll();
        return projects;
    } catch (error) {
        throw new Error(`Error fetching projects: ${error.message}`);
    }
};

const getProjectById = async (projectId) => {
    try {
        const project = await ProjectModel.findByPk(projectId);
        if (!project) {
            throw new Error('Project not found');
        }
        return project;
    } catch (error) {
        throw new Error(`Error fetching project by ID: ${error.message}`);
    }
};

const updateProject = async (projectId, projectData) => {
    try {
        const project = await getProjectById(projectId); // Reusing getProjectById for error handling
        await project.update(projectData);
        return project;
    } catch (error) {
        throw new Error(`Error updating project: ${error.message}`);
    }
};

const deleteProject = async (projectId) => {
    try {
        const project = await getProjectById(projectId); 

        await Promise.all([
            ComponentModel.destroy({ where: { projectId } }),
            LayerModel.destroy({ where: { projectId } }),
            PropertiesModel.destroy({ where: { projectId } }),
            LogoConfigModel.destroy({ where: { projectId } })
        ]);

        await project.destroy();

        return { message: 'Project deleted successfully' };
    } catch (error) {
        console.error(`Error deleting project: ${error.message}`);
        throw new Error('Failed to delete project');
    }
};

const getProjectIdByName = async (projectName) => {
    try {
        const project = await ProjectModel.findOne({
            where: { name: projectName }
        });
        return project ? project.id : null;
    } catch (error) {
        console.error("Error retrieving project:", error);
        throw new Error("Failed to retrieve project");
    }
}

export {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getProjectIdByName
};
