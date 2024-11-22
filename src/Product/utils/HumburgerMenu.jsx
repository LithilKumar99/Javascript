import React, { useContext } from 'react';
import { Collapse, ListGroup } from 'react-bootstrap';
import { StyledButton } from '../Reusable/StyledComponent';
import { OLMapContext } from '../../Context/OlMapContext';
import { useParams } from 'react-router-dom';
import { name } from '../../Utils/AppDetails';

const HumburgerMenu = () => {

    const { projectName: routerProjectName } = useParams();

    const selectedProjectName = routerProjectName === undefined ? name : routerProjectName;

    const { hamburgerMenuOpen, toggleHumburgerMenu, inBuilder } = useContext(OLMapContext);

    return (
        <>
            <div style={{ position: 'relative' }} className='text-center'>
                <div className='d-flex flex-column w-auto position-absolute top-0 end-0 mt-2'>
                    <StyledButton
                        onClick={() => toggleHumburgerMenu(!hamburgerMenuOpen)}
                        aria-controls="mapControlsNavbar"
                        aria-expanded={hamburgerMenuOpen}
                        className='mx-1'
                        style={{ zIndex: '99', top: "50px" }}
                    >
                        <i className="bi bi-list"></i>
                    </StyledButton>
                </div>
                <div className='d-flex w-auto mt-2 position-absolute top-0' style={{ right: '50px', zIndex: '99' }}>
                    <ListGroup horizontal >
                        <ListGroup.Item id="cartButtonList" className='p-0 border-0 me-1' style={{ backgroundColor: 'transparent' }}></ListGroup.Item>
                        <ListGroup.Item id="layerConfigButtonList" className='p-0 border-0 me-1' style={{ backgroundColor: 'transparent' }}></ListGroup.Item>
                        <ListGroup.Item id="profileButtonList" className='p-0 border-0 me-1' style={{ backgroundColor: 'transparent' }}></ListGroup.Item>
                    </ListGroup>
                </div>
                <Collapse in={hamburgerMenuOpen}>
                    <div id="mapControlsNavbar" className='position-absolute end-0' style={{ transition: 'all 0.5s' }}>
                        <ListGroup className='d-flex flex-column mt-5 w-auto mx-1 position-absolute end-0' style={{ zIndex: '99', top: '5px' }}>
                            <ListGroup.Item id="homeButtonList" className='p-0 border-0' style={{ backgroundColor: 'transparent' }}></ListGroup.Item>
                            <ListGroup.Item id="zoomInButtonList" className='p-0 border-0' style={{ backgroundColor: 'transparent' }}></ListGroup.Item>
                            <ListGroup.Item id="zoomOutButtonList" className='p-0 border-0' style={{ backgroundColor: 'transparent' }}></ListGroup.Item>
                            <ListGroup.Item id="previousExtendButtonList" className='p-0 border-0' style={{ backgroundColor: 'transparent' }}></ListGroup.Item>
                            <ListGroup.Item id="nextExtendButtonList" className='p-0 border-0' style={{ backgroundColor: 'transparent' }}></ListGroup.Item>
                            <ListGroup.Item id="zoomWindowButtonList" className='p-0 border-0' style={{ backgroundColor: 'transparent' }}></ListGroup.Item>
                            <ListGroup.Item id="featureInfoButtonList" className='p-0 border-0' style={{ backgroundColor: 'transparent' }}></ListGroup.Item>
                            <ListGroup.Item id="measureButtonList" className='p-0 border-0' style={{ backgroundColor: 'transparent' }}></ListGroup.Item>
                            <ListGroup.Item id="baseMapsButtonList" className='p-0 border-0' style={{ backgroundColor: 'transparent' }}></ListGroup.Item>
                            <ListGroup.Item id="productFilterButtonList" className='p-0 border-0' style={{ backgroundColor: 'transparent' }}></ListGroup.Item>
                            <ListGroup.Item id="s124NavWarningsV2ButtonList" className='p-0 border-0' style={{ backgroundColor: 'transparent' }}></ListGroup.Item>
                            <ListGroup.Item id="s124NavWarningsButtonList" className='p-0 border-0' style={{ backgroundColor: 'transparent' }}></ListGroup.Item>
                            <ListGroup.Item id="s100ProductFeaturesButtonList" className='p-0 border-0' style={{ backgroundColor: 'transparent' }}></ListGroup.Item>
                            <ListGroup.Item id="layerswitcherButtonList" className='p-0 border-0' style={{ backgroundColor: 'transparent' }}></ListGroup.Item>

                            {String(selectedProjectName).toUpperCase().includes('CHS') &&
                                <StyledButton
                                    onClick={() => { }}
                                    style={{ zIndex: '99', top: "50px" }}
                                    title="Map Refresh"
                                >
                                    <i className="bi bi-arrow-clockwise"></i>
                                </StyledButton>
                            }
                        </ListGroup>
                    </div>
                </Collapse>
                <ListGroup className='d-flex flex-column position-absolute ms-1 w-100' style={{ zIndex: '99', top: '5px' }}>
                    <ListGroup.Item id="attributeQueryButtonList" className='p-0 border-0 w-100' style={{ backgroundColor: 'transparent' }} > </ListGroup.Item>
                </ListGroup>
                <ListGroup className='d-flex flex-column position-absolute ms-1 w-100' style={{ zIndex: '99', top: '5px' }}>
                    <ListGroup.Item id="depthFilterButtonList" className='p-0 border-0 w-100' style={{ backgroundColor: 'transparent' }} > </ListGroup.Item>
                </ListGroup>
                <ListGroup className='position-absolute ms-2' style={{ zIndex: '99', top: `${inBuilder ? `calc(100vh - 9vh)` : `100vh`}` }}>
                    <ListGroup.Item id="overViewButtonList" className='p-0 border-0' style={{ backgroundColor: 'transparent' }} > </ListGroup.Item>
                    <ListGroup.Item id="scaleButtonList" className='p-0 border-0' style={{ backgroundColor: 'transparent' }} > </ListGroup.Item>
                </ListGroup>
            </div>
        </>
    );
};

export default HumburgerMenu;
