import React, { useEffect } from "react";
import { Container, Row, Col, Nav, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useColor } from "../../../../Context/ColorContext";
import ExchangeSet from './ExchangeSet/ExchangeSet';
import DataSet from './DataSet/DataSet';
import Providers from "./Providers/Providers";
import './Dashboard.css';
import UserProfile from "./Authentication/UserProfile";

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

    return (
        <>
            {sessionId ? (
                <Container fluid>
                    <Tab.Container id="left-tabs-example" defaultActiveKey={"Providers"}>
                        <Row>
                            <Col sm={2} className="pt-3 shadow" id="dashboard_sidebar">
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item>
                                        <UserProfile></UserProfile>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="Providers" className="text-dark"><i className="bi bi-person-lines-fill me-1"></i> Providers</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="ExchangeSet" className="text-dark"><i className="bi bi-arrow-left-right me-1"></i> Exchange set</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="DataSet" className="text-dark"><i className="bi bi-clipboard-data me-1"></i> Data set</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col sm={10} className="pt-3" id="dashboard_main_content">
                                <Tab.Content>
                                    <Tab.Pane eventKey="Providers"><Providers /></Tab.Pane>
                                    <Tab.Pane eventKey="ExchangeSet"><ExchangeSet /></Tab.Pane>
                                    <Tab.Pane eventKey="DataSet"><DataSet /></Tab.Pane>
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
