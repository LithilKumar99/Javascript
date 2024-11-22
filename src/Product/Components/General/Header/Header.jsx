import React, { useState, useEffect } from 'react';
import { Container, Navbar } from 'react-bootstrap';
import defaultLogo from '../../../assets/images/logo.png';
import { useParams } from 'react-router-dom';
import { useColor } from '../../../Contexts/ColorContext';
import { nodeServerUrl } from '../../../appConfig';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useUtility } from '../../../Contexts/UtilityContext';
import { id, name } from '../../../Utils/AppDetails';

function Header() {

    const { projectId: routeProjectId, projectName: routerProjectName } = useParams();

    const selectedProjectId = routeProjectId === undefined ? id : routeProjectId;
    const selectedProjectName = routerProjectName === undefined ? name : routerProjectName;

    const { logoFlag, updateLogoFlagValue } = useUtility();
    const { backgroundColor, textColor, fontFamily } = useColor();
    const [imageSrc, setImageSrc] = useState(null);
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
        const headerContainer = document.getElementById('headerContainer');
        if (mainContent && headerContainer != null) {
            if (!mainContent.contains(headerContainer)) {
                mainContent.prepend(headerContainer);
            }
        }
    }, []);

    if (!imageSrc) {
        setImageSrc(defaultLogo);
    }
    return (
        <Navbar collapseOnSelect expand="lg" className='p-0' id="headerContainer"
            style={{ backgroundColor: backgroundColor, color: textColor, }}
        >
            <Container>
                <Navbar.Brand href="#" className='d-flex'>
                    <div>
                        {data.length > 0 ? <img
                            src={data[0].image || imageSrc}
                            width="64px"
                            height="56px"
                            alt=""
                            className="d-inline-block align-top"
                        /> : <img
                            src={imageSrc}
                            width="64px"
                            height="56px"
                            alt=""
                            className="d-inline-block align-top"
                        />}
                    </div>
                    <Navbar.Text className='py-3 px-2 mb-0'
                        style={{ color: textColor, fontFamily: fontFamily }}>
                        {selectedProjectName}
                    </Navbar.Text>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            </Container>
        </Navbar>
    );
}

export default Header;