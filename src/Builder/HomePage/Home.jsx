import React, { useState } from 'react';
import logo from '../../assets/images/logo.png';
import { Container, Navbar, Row, Stack, Button, Form, ListGroup } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import CustomModal from '../../Product/Reusable/CustomModal.jsx';
import ConfirmAlert from '../../Product/Reusable/ConfirmAlert.jsx';
import { fetchProjects, updateProjectById, deleteProjectById, createProject } from '../MainLayout/api/projectApi.js';
import { useNavigate } from "react-router-dom";
import { useBuilderContext } from '../Context/BuilderProvider.jsx';
import { useColor } from '../../Context/ColorContext.jsx';

const Home = () => {

  const navigate = useNavigate();
  const { clearDroppedComponents } = useBuilderContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectId, setProjectId] = useState(null);

  const { clearLocalStorageData } = useColor();

  const { data: projects, refetch: refetchProjects } = useQuery('/projects', fetchProjects);

  const handleSubmit = async (event) => {

    const isProjectExist = projects.some(project => project.name === projectName);

    if (isProjectExist) {
      toast.error('Project with the given name already exists');
    }
    else {
      if (modalEditOpen) {
        try {
          if (projectName) {
            await updateProjectById({ id: projectId, formdata: { name: projectName } });
            refetchProjects();
            setProjectName('');
            setProjectId(null);
            setModalOpen(false);
            toast.success('Project name updated successfully.');
          }
          else {
            toast.error('Project name is empty');
          }
        } catch (error) {
          toast.error('Failed to update project');
        }
      }
      else {
        try {
          const formData = { name: projectName, userId: 1 };
          await createProject(formData);
          refetchProjects();
          setProjectName('');
          setModalOpen(false);
          toast.success('Project is created successfully.');
        } catch (error) {
          toast.error('Failed to create project');
        }
      }
    }
  }

  const handleLayout = (projectDetails) => {
    if (projectDetails) {
      clearDroppedComponents();
      clearLocalStorageData();
      navigate(`/mainLayout/${projectDetails.name}/${projectDetails.id}`, { replace: true });
    }
  }

  const handleEdit = (projectDetails) => {
    setModalOpen(true);
    setModalEditOpen(true);
    setProjectName(projectDetails.name);
    setProjectId(projectDetails.id);
  }

  const handleDelete = async (projectId) => {
    try {
      await deleteProjectById(projectId);
      toast.success('Project is deleted successfully.');
      refetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  }


  const Header = () => {
    return (
      <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home" className='text-white'>
            <img alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top me-2"
            />
            IIC App Builder
          </Navbar.Brand>
        </Container>
      </Navbar>
    )
  }

  const handleNew = () => {
    clearLocalStorageData();
    setModalOpen(true);
    setModalEditOpen(false);
    setProjectName('');
  }

  return (
    <>
      <Header />
      <Container>
        <Row>
          <Stack direction="horizontal" gap={3}>
            <div className="p-2"><h2>Create Apps</h2></div>
            <div className="p-2 ms-auto"> <Button onClick={handleNew} variant="primary">New</Button></div>
          </Stack>
        </Row>
        <ListGroup variant="flush">
          {Array.isArray(projects) && projects.map((projectDetail, index) => {
            return (
              <ListGroup.Item key={index}>
                <Stack direction="horizontal" gap={10}>
                  <h4>{projectDetail.name}</h4>
                  <div className="ms-4"><Button title='Click to edit the Project Title' variant='outline-success' onClick={() => handleEdit(projectDetail)}>
                    <i className="bi bi-pencil"></i></Button></div>
                  <div className="ms-auto"><Button title="Edit" variant='primary' onClick={() => handleLayout(projectDetail)}><i className="bi bi-layout-text-window"></i></Button></div>
                  <div className="ms-4"> <ConfirmAlert message={`Are you sure you want to delete ${projectDetail.name} project?`} handleDelete={() => handleDelete(projectDetail.id)} /></div>
                </Stack>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Container>
      <CustomModal show={modalOpen} onHide={() => { setModalOpen(false) }} size="lg"
        onSubmit={handleSubmit} title={modalEditOpen === false ? `New Project` : `Edit Project`} buttonValue='Submit'>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicProjectname">
            <Form.Label>Enter Project Name</Form.Label>
            <Form.Control type="text" placeholder="Projectname"
              value={projectName}
              onChange={(e) => { setProjectName(e.target.value) }}
            />
          </Form.Group>
        </Form>
      </CustomModal>
    </>
  )
}

export default Home;
