import React, { useContext, useState, useRef } from 'react'
import { useEffect } from 'react';
import { Card, Stack, Tabs, Tab } from 'react-bootstrap';
import Product from './Product/Product';
import AgencyCodes from './AgencyCode/AgencyCode';
import Countries from './Countries/Countries';
import ProductTypes from './ProductTypes/ProductTypes';
import UsageBands from './UsageBands/UsageBands';
import GeoTools from './GeoTools/GeoTools';
import BottomTable from '../utils/BottomTable.jsx';
import { S1412windLayer } from '../config.js';
import ResultTable from './Utils/ResultTable/ResultTable.jsx';
import { clearHighLightVectorData, clearVectorSource } from './Utils/OpenLayersUtils/OpenLayers.js';
import { RTZFileContext } from './Context/RTZFileContext.jsx';
import CustomConfirmModel from '../../../Reusable/CustomConfirmModel';
import { useProductFilter } from './Context/ProductFilterContext';
import { OLMapContext } from '../../../../Context/OlMapContext';
import { CloseButton, StyledMapControlButton, StyledLoaderInner, StyledLoaderWraper, StyledButton } from '../../../Reusable/StyledComponent';
import { useUtility } from '../../../../Context/UtilityContext';
import { useColor } from '../../../../Context/ColorContext'

function ProductFilter() {

    const [title] = useState('OscProductFilter');
    const { olMap, getAllVisibleLayers, stopDrawAction } = useContext(OLMapContext);
    const { clearRtZFileCoordinates } = useContext(RTZFileContext);

    const { updateMapLayers, isLoading, calenderSelectedInfoSucess,
        featureData, updateHeader, selectedMapLayer, flag, setFlag,
        clearFeatureData, makeInitialState, showGeometryClearDialog,
        setShowGeometryClearDialog } = useProductFilter();

    const { toggleComponent, toggleProductFilterSideBarPanel,
        updateCollapsedQueryResultPanel, isProductFilterButtonActive } = useUtility();

    const { backgroundColor, textColor, borderColor, fontFamily } = useColor();

    const popupCloserRef = useRef(null);

    const [tabActiveItem, setTabActiveItem] = useState('defaultTab');

    const [showClearModal, setShowClearModal] = useState(false);


    useEffect(() => {

        if (olMap) {

            var productFilterButtonList = document.getElementById('productFilterButtonList');
            const productFilterbuttonContainer = document.getElementById('productFilterbuttonContainer');
            if (productFilterButtonList && productFilterbuttonContainer != null) {
                if (!productFilterButtonList.contains(productFilterbuttonContainer)) {
                    productFilterButtonList.append(productFilterbuttonContainer);
                }
            }

            const productFilterInfoSidebar = document.getElementById('productFilterInfoSidebar');
            var productFilterSidebarConatiner = document.getElementById('productFilterSidebarConatiner');
            if (productFilterInfoSidebar != null && productFilterSidebarConatiner != null) {
                productFilterInfoSidebar.appendChild(productFilterSidebarConatiner);
            }

            const mapContainer = document.getElementById('map-container');
            const productFilterQueryTable = document.getElementById('productFilterQueryTable');

            if (mapContainer && productFilterQueryTable) {
                mapContainer.appendChild(productFilterQueryTable);
            }
        }

    }, [olMap]);

    const getLayers = () => {
        const allVisibleLayers = getAllVisibleLayers(olMap);
        updateMapLayers(allVisibleLayers);
    }

    const handleProductFilter = () => {
        getLayers();
        toggleComponent(title);
    }

    const handleCloseSideBar = () => {
        toggleComponent('default')
        toggleProductFilterSideBarPanel(false);
        updateCollapsedQueryResultPanel(false);
    }

    useEffect(() => {
        setTabActiveItem(featureData[0]?.layerName || 'defaultTab')
    }, [featureData])

    const handleTabClick = (layerName) => {
        setTabActiveItem(layerName);
        const newHeading = featureData.find((feature) => feature.layerName === layerName);
        if (newHeading) {
            const { data } = newHeading;
            const headings = Object.keys(data[0] || {});
            updateHeader(headings);
        }
    };

    const handleShowClearModal = () => {
        setShowClearModal(true);
    }

    const handleCloseClearModal = () => {
        setShowClearModal(false);
    }

    const handleCloseGeometryClearDialog = () => {
        setShowGeometryClearDialog(false);
    }

    const handleClear = () => {

        if (flag === true) {
            setFlag(false);
        }
        makeInitialState();
        for (let i = 0; i <= 4; i++) {
            clearVectorSource(olMap);
        }

        clearRtZFileCoordinates();
        stopDrawAction();
        updateCollapsedQueryResultPanel(false);
    };

    const clearSource = () => {
        if (flag === true) {
            setFlag(false);
        }
        clearFeatureData();
        for (let i = 0; i <= 4; i++) {
            clearVectorSource(olMap);
        }
        clearHighLightVectorData(olMap)
        stopDrawAction();
        updateCollapsedQueryResultPanel(false);
    }

    return (
        <div>
            <div id='productFilterbuttonContainer' style={{ position: "relative" }}>
                <StyledMapControlButton title={title} id={title}
                    className={`p-1 mb-1 ${isProductFilterButtonActive ? 'active' : ''}`}
                    onClick={handleProductFilter}
                >
                    <i className="bi bi-funnel" />
                </StyledMapControlButton>
            </div>

            <div id='productFilterSidebarConatiner'>
                <Card id='popup-content' style={{ borderColor: borderColor, minHeight: '500px' }}>
                    <Card.Header className='pe-2' style={{ backgroundColor, color: textColor, borderColor, fontFamily }}>
                        <Stack direction='horizontal'>
                            <div className='mb-0'><i className='bi bi-funnel me-2'></i>Product filter</div>
                            <CloseButton onClick={handleCloseSideBar} ref={popupCloserRef} id='popup-closer' className='ms-auto'>
                                <i className='bi bi-x'></i>
                            </CloseButton>
                        </Stack>
                    </Card.Header>
                    <Card.Body>
                        {isLoading && (
                            <StyledLoaderWraper>
                                <StyledLoaderInner />
                            </StyledLoaderWraper>
                        )}
                        <Product></Product>
                        {selectedMapLayer !== S1412windLayer ? <>
                            <AgencyCodes></AgencyCodes>
                            <Countries></Countries>
                            <ProductTypes></ProductTypes>
                            <UsageBands></UsageBands>
                            <GeoTools></GeoTools>
                        </> : <>
                            <GeoTools></GeoTools>
                            {JSON.stringify(selectedMapLayer) && calenderSelectedInfoSucess && selectedMapLayer === S1412windLayer && <p>Now you can select the windmap grids by using spatial query</p>}
                        </>
                        }
                    </Card.Body>
                    <Card.Footer className='text-end' style={{ borderColor: borderColor, fontFamily: fontFamily }}>
                        {selectedMapLayer != 'select' && <StyledButton id="btn-Clear" onClick={handleShowClearModal}>Clear</StyledButton>}
                    </Card.Footer>
                </Card>
                <CustomConfirmModel show={showClearModal} title='Product filter' content={'Are you sure you want to clear the results ?'} onHide={handleCloseClearModal} onSaveChanges={() => { handleClear() }} />
                <CustomConfirmModel show={showGeometryClearDialog} title='Product filter' content={'Are you sure you want to clear the results ?'} onHide={handleCloseGeometryClearDialog} onSaveChanges={() => { clearSource() }} />
            </div>

            <div id='productFilterQueryTable'>
                {featureData.length > 0 && <BottomTable type="productFilter">
                    <Tabs activeKey={tabActiveItem} onSelect={handleTabClick} variant="pills">
                        {featureData?.map((feature, index) => (
                            <Tab eventKey={feature?.layerName} title={feature?.layerName} key={index}>
                                <Card className="mt-2">
                                    <ResultTable featureData={feature?.data} title={feature?.layerName}></ResultTable>
                                </Card>
                            </Tab>
                        ))}
                    </Tabs>
                </BottomTable>}
            </div>
        </div >
    )
}

export default ProductFilter;