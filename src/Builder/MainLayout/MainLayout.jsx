import React, { useContext, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "./Components/Header/Header.jsx";
import SidebarTabs from "./Components/Sidebar/SidebarTabs";
import RenderComponents from "./RenderComponents";
import { getComponentsBasedOnProjectId } from "../MainLayout/api/componentApi";
import { useBuilderContext } from "../Context/BuilderProvider";
import { OLMapContext } from "../../Context/OlMapContext";
import { calculateMapHeight } from "./Utils/Utils";
import { isBuilder } from "../../Utils/AppDetails";
import './MainLayout.css';

const MainLayout = () => {

    const { projectId } = useParams();

    const { draggedComponents, compareUpdateDraggedComponents,
        deletedComponent, deleteComponent, clearDroppedComponents, deletedLayer, updateDeleteLayer } = useBuilderContext();

    const { updateMapHeight, updateInBuilder } = useContext(OLMapContext);

    useEffect(() => {
        clearDroppedComponents();
        const fetchData = async () => {
            try {
                const response = await getComponentsBasedOnProjectId(parseInt(projectId));
                if (response) {
                    clearDroppedComponents();
                    response.map((item) => {
                        compareUpdateDraggedComponents(item.component);
                    });
                }
                deleteComponent(false);
                updateDeleteLayer(false);
            } catch (error) {
                toast.warn("error fetching components");
            }
        };
        fetchData();
        updateInBuilder(false);
        const height = calculateMapHeight(draggedComponents, true);
        updateMapHeight(height);
        updateInBuilder(isBuilder);

    }, [projectId, deletedComponent, deletedLayer]);

    return (
        <Container fluid>
            <Row>
                <Header />
                <Col md={3} style={{ height: 'calc(100vh - 56px)', overflow: 'auto' }} className="pe-0 navbar-nav bg-gradient-primary sidebar sidebar-dark accordion">
                    <SidebarTabs />
                </Col>
                <Col md={9} className="px-0">
                    <main>
                        <div className="border border-2 border-dashed border-gray">
                            <RenderComponents draggedComponents={draggedComponents} />
                        </div>
                    </main>
                </Col>
            </Row>
        </Container>
    );
};

export default MainLayout;
