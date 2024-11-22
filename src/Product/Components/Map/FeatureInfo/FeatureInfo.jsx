import React, { useEffect, useState, useContext } from 'react'
import { CloseButton, StyledLoaderInner, StyledLoaderWraper, StyledMapControlButton } from '../../../Reusable/StyledComponent';
import { Table, Card, Stack, Container } from "react-bootstrap";
import Pagination from 'react-bootstrap/Pagination';
import { useUtility } from '../../../../Context/UtilityContext';
import { OLMapContext } from '../../../../Context/OlMapContext';
import { useColor } from '../../../../Context/ColorContext';
import './FeatureInfo.css';

function FeatureInfo() {

    const [title] = useState('FeatureInfo');

    const { olMap, clearMapVectorLayerSource, createHighlightedFeaturesLayer,
        getMapClickFeatures, isFeatureInfoLoader } = useContext(OLMapContext);

    const { backgroundColor, textColor, borderColor, fontFamily } = useColor();

    const { isFeatureInfoButtonActive, isFeatureInfoButtonActiveFlag,
        toggleFeatureInfoButtonActiveFlag, registerFeatureInfoMapClickHandler,
        unRegisterFeatureInfoMapClickHandlers, toggleComponent, mapClickFeatureInfoRecords,
        updateMapClickFeatureInfoRecords, mapClickFeaturesGeometry, updateMapClickFeaturesGeometry,
        updateMapClickFeatureInfoLayerName, mapClickFeatureInfoLayerName } = useUtility();

    const sidebarHeight = window.innerHeight;
    const [columns, setColumns] = useState([]);
    const recordsPerPage = 1;
    const [currentPage, setCurrentPage] = useState(1);
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const [records, setRecords] = useState([]);
    const numberOfPages = Math.ceil(mapClickFeatureInfoRecords.length / recordsPerPage);
    const pageNumbers = Array.from({ length: numberOfPages }, (_, i) => i + 1);

    useEffect(() => {

        if (olMap) {
            var featureInfoButtonList = document.getElementById('featureInfoButtonList');
            const featureInfoContainer = document.getElementById('featureInfoContainer');
            if (featureInfoButtonList && featureInfoContainer != null) {
                if (!featureInfoButtonList.contains(featureInfoContainer)) {
                    featureInfoButtonList.append(featureInfoContainer);
                }
            }

            var featureInfoSidebar = document.getElementById('featureInfoSidebar');
            const featureInfoSidebarConatiner = document.getElementById('featureInfoSidebarConatiner');
            if (featureInfoSidebar != null && featureInfoSidebarConatiner != null) {
                featureInfoSidebar.append(featureInfoSidebarConatiner);
            }

            const mapContainer = document.getElementById('map-container');
            const productFilterable = document.getElementById('productFilterable');

            if (mapContainer && productFilterable) {
                mapContainer.appendChild(productFilterable);
            }
        }
    }, [olMap]);

    useEffect(() => {
        setCurrentPage(1);
        if (mapClickFeatureInfoRecords.length > 0) {
            setRecords([]);
            setColumns(Object.keys(mapClickFeatureInfoRecords[0]));
            var data = mapClickFeatureInfoRecords.slice(firstIndex, lastIndex);
            setRecords(data);
        } else {
            setColumns([]);
        }
    }, [mapClickFeatureInfoRecords]);

    const handleMapClick = async (event) => {
        setRecords([]);
        updateMapClickFeatureInfoRecords([]);
        const data = await getMapClickFeatures(event, "featureInfo");
        if (data) {
            if (Array.isArray(data?.geometry) && data.geometry.length > 0) {
                const geometries = data.geometry;
                const combinedGeometry = geometries.flat();
                updateMapClickFeaturesGeometry(combinedGeometry);
            }
            updateMapClickFeatureInfoRecords(data?.features);
            updateMapClickFeatureInfoLayerName(data?.features[0]?.layerName);
        }
    };

    const handleFeatureInfo = () => {
        toggleComponent(title);
        setColumns([]);
        setRecords([]);
        let featureInfoBtn = document.getElementById("featureInfoBtn");
        if (featureInfoBtn) {
            featureInfoBtn.classList.add('active');
        }

        if (isFeatureInfoButtonActiveFlag === false) {
            olMap.getTargetElement().style.cursor = 'pointer';
            registerFeatureInfoMapClickHandler('click', handleMapClick, olMap);
            toggleFeatureInfoButtonActiveFlag(true);
        } else {
            if (featureInfoBtn) {
                featureInfoBtn.classList.remove('active');
                olMap.getTargetElement().style.cursor = 'default';
                unRegisterFeatureInfoMapClickHandlers(olMap);
                toggleFeatureInfoButtonActiveFlag(false);
            }
        }
    }

    const renderPageNumbers = () => {
        const visiblePages = 4;
        const middleIndex = Math.floor(visiblePages / 2);

        if (numberOfPages <= visiblePages) {
            return pageNumbers.map((n) => (
                <Pagination.Item key={n} active={currentPage === n} onClick={() => changeCurrentPage(n)}>
                    {n}
                </Pagination.Item>
            ));
        } else {
            let pagesToDisplay = [];

            if (currentPage <= middleIndex) {
                pagesToDisplay = [...pageNumbers.slice(0, visiblePages), 'ellipsis', numberOfPages];
            } else if (currentPage > numberOfPages - middleIndex) {
                pagesToDisplay = [1, 'ellipsis', ...pageNumbers.slice(-visiblePages)];
            } else {
                pagesToDisplay = [
                    1,
                    'ellipsis',
                    ...pageNumbers.slice(currentPage - middleIndex, currentPage + middleIndex - 1),
                    'ellipsis',
                    numberOfPages
                ];
            }

            return pagesToDisplay.map((page, index) => (
                <React.Fragment key={index}>
                    {page === 'ellipsis' ? (
                        <Pagination.Ellipsis />
                    ) : (
                        <Pagination.Item active={currentPage === page} onClick={() => changeCurrentPage(page)}>
                            {page}
                        </Pagination.Item>
                    )}
                </React.Fragment>
            ));
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= numberOfPages) {
            setCurrentPage(newPage);

            const startIndex = (newPage - 1) * recordsPerPage;
            const endIndex = startIndex + recordsPerPage;
            const newRecords = [];

            for (let i = startIndex; i < endIndex && i < mapClickFeatureInfoRecords.length; i++) {
                newRecords.push(mapClickFeatureInfoRecords[i]);
            }

            setRecords(newRecords);
            const newColumns = Object.keys(newRecords[0] || {});
            setColumns(newColumns);

            if (newRecords.length > 0) {
                const updatedLayerName = newRecords[0].layerName;
                updateMapClickFeatureInfoLayerName(updatedLayerName);
            }

            if (mapClickFeaturesGeometry.length > 0) {
                const data = mapClickFeaturesGeometry[currentPage - 1];
                if (data) {
                    clearMapVectorLayerSource(olMap);
                    const vectorLayer = createHighlightedFeaturesLayer(data);
                    const features = vectorLayer.getSource().getFeatures();

                    if (features.length > 0) {
                        const geometry = features[0].getGeometry();
                        let center;

                        switch (geometry.getType()) {
                            case 'Point':
                                center = geometry.getCoordinates();
                                break;
                            case 'LineString':
                                center = geometry.getCoordinates()[Math.floor(geometry.getCoordinates().length / 2)];
                                break;
                            case 'Polygon':
                                center = geometry.getInteriorPoint().getCoordinates();
                                break;
                            default:
                                center = geometry.getCoordinates()[0];
                                break;
                        }

                        olMap.getView().setCenter(center);
                    }
                    olMap.addLayer(vectorLayer);
                }
            }
        }
    };

    const prePage = () => {
        handlePageChange(currentPage - 1);
    };

    const changeCurrentPage = (page) => {
        handlePageChange(page);
    };

    const nextPage = () => {
        handlePageChange(currentPage + 1);
    };

    const handleCloseSideBar = () => {
        toggleComponent("default")
    }

    function formatString(str) {
        let formattedStr = String(str).replace(/_/g, ' ');
        formattedStr = formattedStr.charAt(0).toUpperCase() + formattedStr.slice(1);
        formattedStr += ' ';
        return formattedStr;
    }

    return (
        <>
            <div id='featureInfoContainer' style={{ position: "relative" }}>
                <StyledMapControlButton title={title} id={title} className={`p-1 mb-1 ${isFeatureInfoButtonActive ? 'active' : ''}`}
                    onClick={(e) => { handleFeatureInfo(e) }}
                >
                    <i className="bi bi-info-circle" />
                </StyledMapControlButton>
            </div>
            <div id='featureInfoSidebarConatiner'>
                {isFeatureInfoLoader && (
                    <StyledLoaderWraper>
                        <StyledLoaderInner />
                    </StyledLoaderWraper>
                )}
                {mapClickFeatureInfoRecords && mapClickFeatureInfoRecords.length > 0 ? (<Card id='popup-content' style={{ borderColor: borderColor }}>
                    <Card.Header className="pe-1" style={{ backgroundColor: backgroundColor, color: textColor }}>
                        <Stack direction="horizontal">
                            <i className="bi bi-info-circle me-2"></i>
                            {mapClickFeatureInfoRecords.length > 0 ? <h6 className="mb-0">{mapClickFeatureInfoLayerName !== null && mapClickFeatureInfoLayerName}</h6> : <h6 className="mb-0"> Feature information</h6>}
                            <CloseButton onClick={handleCloseSideBar} id="popup-closer" className="ms-auto">
                                <i className="bi bi-x"></i>
                            </CloseButton>
                        </Stack>
                    </Card.Header>
                    <Card.Body className="p-0" style={{ position: 'relative', maxHeight: `calc(${sidebarHeight}px - 105px)`, height: 'auto', minHeight: '100px', overflow: 'auto' }}>
                        <Table responsive className="table table-striped featureinfoTable">
                            <tbody>
                                {
                                    records && records.map((item, index) => (
                                        columns.map((column, columnIndex) => (
                                            <tr key={columnIndex}>
                                                <th style={{ width: '50%', textTransform: 'capitalize' }}>{formatString(column)}</th>
                                                <td style={{ width: '50%' }}>
                                                    {item[column] &&
                                                        (typeof item[column] === "object" ? (
                                                            Object.entries(item[column]).map(([key, value]) => (
                                                                <div key={key}>
                                                                    <strong>{key}:</strong> {value}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            item[column]
                                                        ))}
                                                </td>
                                            </tr>
                                        ))
                                    ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                    <Card.Footer className="px-1" style={{ borderColor: borderColor, fontFamily: fontFamily }}>
                        <Container className='px-0'>
                            <nav style={{ overflow: 'auto' }}>
                                <Pagination className='mb-0 justify-content-center'>
                                    <Pagination.Prev onClick={prePage} />
                                    {renderPageNumbers()}
                                    <Pagination.Next onClick={nextPage} />
                                </Pagination>
                            </nav>
                        </Container>
                    </Card.Footer>
                </Card>) : (
                    <Card>
                        <Card.Header className="pe-1" style={{ backgroundColor: backgroundColor, color: textColor }}>
                            <Stack direction='horizontal'>
                                <div className='mb-0'>
                                    <i className="bi bi-info-circle me-2"></i>
                                    Feature information
                                </div>
                                <CloseButton onClick={handleCloseSideBar} id='popup-closer' className='ms-auto'>
                                    <i className='bi bi-x'></i>
                                </CloseButton>
                            </Stack>
                        </Card.Header>
                        <Card.Body>
                            <h6>Please Select feature on the map to see the information.</h6>
                        </Card.Body>
                    </Card>
                )}
            </div>
        </>
    )
}

export default FeatureInfo;