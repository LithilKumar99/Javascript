import React, { useEffect } from "react";
import { Container, Row, Col, Nav, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { useColor } from "../../../Contexts/ColorContext";
import UserProfile from "./Authentication/UserProfile";
import { sidebarItems } from "./Dashboard";

function Dashboard() {

    const { backgroundColor, textColor, borderColor } = useColor();
    const navigate = useNavigate();
    var sessionId = sessionStorage.getItem('sessionId');

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .nav-pills .nav-link.active, .nav-pills .show > .nav-link{
                background-color: ${borderColor};
                border-color: ${backgroundColor};
                color: ${backgroundColor};
            }
        `;
        document.head.appendChild(style);

        const handleSessionExpiration = () => {
            if (!sessionId) {
                navigate('/', { replace: true });
            }
        };

        handleSessionExpiration();

    }, [sessionId, navigate]);

    const style = document.createElement('style');
    style.innerHTML = `
            div.dt-container .dt-paging .dt-paging-button.current {
              background: ${backgroundColor};
              color: ${textColor}!important;
              border: 1px solid ${borderColor} !important;

            }
              div.dt-container .dt-paging .dt-paging-button:hover,div.dt-container .dt-paging .dt-paging-button.current:hover,
              div.dt-container .dt-paging .dt-paging-button:active{
                background: ${borderColor};
                border: 1px solid ${backgroundColor} !important;
                color: ${backgroundColor} !important;
                box-shadow: none;
            }
          `;
    document.head.appendChild(style);

    const sidebar = sidebarItems.map(item => (
        <Nav.Item key={item.eventKey}>
            <Nav.Link eventKey={item.eventKey} className="text-dark">
                <i className={`${item.icon} me-1`}></i>{item.label}
            </Nav.Link>
        </Nav.Item>
    ));

    const tabContent = sidebarItems.map(item => (
        <Tab.Pane key={item.eventKey} eventKey={item.eventKey} className="text-center">
            <item.component />
        </Tab.Pane>
    ));

    return (
        <>
            {sessionId ? (
                <Container fluid>
                    <Tab.Container id="left-tabs-example" defaultActiveKey='Users'>
                        <Row>
                            <Col sm={2} className="pt-3 shadow" id="dashboard_sidebar">
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item>
                                        <UserProfile />
                                    </Nav.Item>
                                    {sidebar}
                                </Nav>
                            </Col>
                            <Col sm={10} className="pt-3" id="dashboard_main_content">
                                <Tab.Content>
                                    {tabContent}
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </Container>
            ) : null}
        </>
    );
}

export default Dashboard;
