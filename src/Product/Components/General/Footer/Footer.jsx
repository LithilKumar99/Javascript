import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap'
import defaultLogo from '../../../assets/images/logo.png';
import { useEffect, useState, } from 'react';
import { useParams } from 'react-router-dom';
import { useColor } from '../../../Contexts/ColorContext';
import axios from 'axios';
import { nodeServerUrl } from '../../../appConfig';
import { toast } from 'react-toastify';
import { useUtility } from '../../../Contexts/UtilityContext';
import { id, name } from '../../../Utils/AppDetails';

const Footer = () => {

    const { projectId: routeProjectId, projectName: routerProjectName } = useParams();

    const selectedProjectId = routeProjectId === undefined ? id : routeProjectId;
    const selectedProjectName = routerProjectName === undefined ? name : routerProjectName;

    const { backgroundColor, textColor, fontFamily } = useColor();
    const [imageSrc, setImageSrc] = useState(null);
    const { logoFlag, updateLogoFlagValue } = useUtility();

    const [data, setData] = useState([]);

    const fetchprojectLogoData = async () => {
        try {
            const response = await axios.get(`${nodeServerUrl}/logo/${selectedProjectId}`);
            if (response.data) {
                setData([response.data]);
            }
        } catch (err) {
            setData([]);
            //toast.warn(`Thier are no records found for ${projectName}`);
        }
    };

    useEffect(() => {
        fetchprojectLogoData();
        updateLogoFlagValue(false);
    }, [selectedProjectId, logoFlag])

    useEffect(() => {
        var mainContent = document.querySelector('.main-content');
        const footerContainer = document.getElementById('footerContainer');
        if (mainContent && footerContainer != null) {
            if (!mainContent.contains(footerContainer)) {
                mainContent.append(footerContainer);
            }
        }
    }, []);

    if (!imageSrc) {
        setImageSrc(defaultLogo);
    }

    return (
        <Navbar id="footerContainer" className="border-top shadow text-white"
            style={{ backgroundColor, color: textColor, }}>
            <Container>
                <Navbar.Brand href="#home">
                    <div>
                        {data.length > 0 ? <img
                            src={data[0].image || imageSrc}
                            width="40px"
                            height="30px"
                            alt=""
                            className="d-inline-block align-top"
                        /> : <img
                            src={imageSrc}
                            width="40px"
                            height="30px"
                            alt=""
                            className="d-inline-block align-top"
                        />}
                    </div>
                </Navbar.Brand>
                <Nav className='mx-auto'>
                    <Nav.Link style={{ color: textColor, fontFamily }}>© 2023 {selectedProjectName}, Inc</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}
export default Footer;