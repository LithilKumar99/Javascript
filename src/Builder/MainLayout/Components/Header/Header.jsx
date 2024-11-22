import React, { useState } from "react";
import { Container, Nav, Navbar, Image, Button, ProgressBar, Spinner } from "react-bootstrap";
import { Modal, FloatingLabel, Form } from 'react-bootstrap';
import logo from "../../../../assets/images/logo.png";
import { toast } from "react-toastify";
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { createComponent, getComponentsBasedOnProjectId } from "../../api/componentApi";
import { useBuilderContext } from "../../../Context/BuilderProvider";
import { nodeServerUrl } from "../../../../appConfig";
import { AppCodePreview } from "../../../CodePreview";
import { calculateMapHeight } from "../../Utils/Utils";

function Header() {

  const navigate = useNavigate();
  const { projectId, projectName } = useParams();
  const createMutation = useMutation(createComponent);
  const { draggedComponents, updateIsFetchComponents } = useBuilderContext();

  const [isLoading, setIsLoading] = useState(false);

  const [show, setShow] = useState(false);
  const [text, setText] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClear = () => setText('');

  const mapHeight = calculateMapHeight(draggedComponents, true);

  const [downloadProgress, setDownloadProgress] = useState(0);

  const { data: components, refetch } = useQuery(
    ['/components', projectId],
    () => getComponentsBasedOnProjectId(projectId)
  );

  const handleSave = async () => {
    try {
      if (!components || components.length === 0) {
        await Promise.all(
          draggedComponents.map(async (component) => {
            const componentData = { component, projectId };
            await createComponent(componentData);
          })
        );
        refetch();
        toast.success('Components saved successfully');
        updateIsFetchComponents(true);
        return;
      }

      const newComponents = draggedComponents.filter(
        (component) => !components.some((item) => item.component === component)
      );

      if (newComponents.length > 0) {
        await Promise.all(
          newComponents.map(async (component) => {
            const componentData = { component, projectId };
            await createMutation.mutateAsync(componentData);
          })
        );
        refetch();
        toast.success('New components saved successfully');
      } else {
        toast.warn('All components are already saved');
      }
    } catch (error) {
      //toast.error('Failed to save components');
    }
  };

  const handleHome = () => {
    navigate('/');
  }

  const fetchLayers = async () => {
    try {
      const response = await axios.get(`${nodeServerUrl}/getlayers/${projectId}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      setError("Failed to fetch layers. Please try again later.");
      toast.error('Failed to fetch layers. Please try again later');
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${nodeServerUrl}/properties/${projectId}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      setError("Failed to fetch properties. Please try again later.");
      toast.warn("Failed to fetch properties. Please try again later.")
    }
  };

  async function fetchData() {
    try {
      const appCode = AppCodePreview(draggedComponents, projectName);
      const data = await fetchLayers();
      const properties = await fetchProperties();

      const requestData = {
        droppedComponents: draggedComponents,
        appCode: appCode,
        projectName: projectName,
        projectId: projectId,
        mapHeight: mapHeight,
        layersData: data,
        propertiesData: properties,
      };

      return requestData;
    } catch (error) {
      toast.error('Failed to fetch data', error.message);
      throw error;
    }
  }


  const handleDownload = async () => {

    setDownloadProgress(0);

    const requestData = await fetchData();

    axios.post(`${nodeServerUrl}/downloadProject`, requestData, {
      onDownloadProgress: progressEvent => {
        const total = progressEvent.total;
        const loaded = progressEvent.loaded;
        const interval = 1000;
        const steps = total / interval;
        let currentProgress = 0;
        let intervalId = setInterval(() => {
          currentProgress += 100 / steps;
          if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(intervalId);
          }
          setDownloadProgress(Math.round(currentProgress));
        }, interval);
      }
    })
      .then(response => {
        if (response.data === 'Files successfully downloaded') {
          setTimeout(() => {
            fetch(`${nodeServerUrl}/downloadProjectZipFolder`)
              .then((response) => {
                return response.blob();
              })
              .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = projectName + '.zip';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                toast.success('Project successfully downloaded');
                setDownloadProgress(0);
              })
          }, 1500);
        }
      })
      .catch(error => {
        toast.warn('error downloading project');
      });
  }

  const handlePreview = () => {
    const queryParams = new URLSearchParams();
    queryParams.append('data', JSON.stringify(draggedComponents));
    const url = `/preview/${projectName}/${projectId}?${queryParams.toString()}`;
    window.open(url, '_blank');
  }

  const handleSubmit = async () => {
    try {
      const requestData = await fetchData();
      requestData.commitMessage = text;
      setIsLoading(true);
      axios.post(`${nodeServerUrl}/pushcode`, requestData)
        .then(response => {
          console.log('Response:', response.data);
          toast.info(`${response.data.message}`);
          setShow(false);
        })
        .catch(error => {
          toast.warn('Failed to commit code to GitHub');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      toast.warn('Failed to commit code to GitHub');
      setIsLoading(false);
    }
  };

  const navList = [
    {
      list: "Home",
      icon: <i className="bi bi-house-up me-2"></i>,
      onclick: handleHome
    },
    {
      list: "Save",
      icon: <i className="bi bi-save2 me-2"></i>,
      onclick: handleSave
    },
    {
      list: "Preview",
      icon: <i className="bi bi-display me-2"></i>,
      onclick: handlePreview
    },
    {
      list: "Download",
      icon: <i className="bi bi-download me-2"></i>,
      onclick: handleDownload
    },
  ];

  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="shadow-sm bg-light">
        <Container fluid>
          <Navbar.Brand href="#home">
            <Image src={logo} alt='App Builder' fluid style={{ width: '30px', height: '30px' }} className="d-inline-block align-top me-2" />
            IIC App Builder
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mx-auto">
              {navList.map((item) => {
                return (
                  <React.Fragment key={item.list}>
                    <Button size="sm" variant='primary' className="px-4 me-1" onClick={item.onclick}>
                      {item.icon}
                      {item.list}
                      {item.list === "Download" && downloadProgress > 0 && (
                        <ProgressBar now={downloadProgress} label={`${downloadProgress}%`} />
                      )}
                    </Button>
                  </React.Fragment>
                )
              })}
            </Nav>
            <Nav>
              <Nav.Link className="px-3"><b>Guest</b></Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Git Publish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="floatingInput" label="Comments" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Comments"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          {isLoading ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <>
              <Button variant="secondary" onClick={handleClear}>
                Clear
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Header;
