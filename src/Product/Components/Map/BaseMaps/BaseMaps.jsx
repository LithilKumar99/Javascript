import React, { useContext, useEffect, useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import TileLayer from "ol/layer/Tile";
import TileWMS from 'ol/source/TileWMS';
import BingMaps from "ol/source/BingMaps.js";
import OSM from 'ol/source/OSM';
import { Popover, Card } from 'react-bootstrap';
import { CloseButton, StyledMapControlButton, StyledPopover } from '../../../Reusable/StyledComponent';
import { BingMapKey, GebcoUrl } from '../../../../appConfig';
import { useUtility } from '../../../../Context/UtilityContext';
import { useColor } from '../../../../Context/ColorContext';
import { OLMapContext } from '../../../../Context/OlMapContext';

function BaseMaps() {

    const [title] = useState('BaseMaps');
    const { olMap } = useContext(OLMapContext);
    const { isBaseMapWindowButtonVisible, toggleComponent, isBaseMapButtonActive } = useUtility();
    const { backgroundColor, textColor, borderColor, typoColor } = useColor();
    const [imgWidth] = useState('60px');
    const [imgHeight] = useState('50px');

    const imageArray = [
        {
            src: 'https://blogs.bing.com/BingBlogs/media/MapsBlog/2018/07/RouteOptimizationScreenshot_1.png',
            onClick: () => loadBingMapLayer('Road'),
            title: 'Road',
        },
        {
            src: 'https://blogs.bing.com/getmedia/e0997fa5-6974-4279-b5e2-4f9e0927404d/2475.clip_5F00_image005_5F00_035C7AD0.aspx',
            onClick: () => loadBingMapLayer('AerialWithLabels'),
            title: 'Labels',
        },
        {
            src: 'https://learn.microsoft.com/en-us/bingmaps/getting-started/google-maps-to-bing-maps-migration-guide/media/image8.png',
            onClick: () => loadBingMapLayer('RoadDark'),
            title: 'RoadDark',
        },
        {
            src: 'https://static.packt-cdn.com/products/9781782165101/graphics/5101_04_4_512x512.jpg',
            onClick: () => loadingOSM(),
            title: 'OSM',
        },
        {
            src: ' https://www.gebco.net/data_and_products/images/gebco_2020_grid.png',
            onClick: () => loadGebcoMap(),
            title: 'Gebco',
        },
    ];

    useEffect(() => {
        var baseMapsButtonList = document.getElementById('baseMapsButtonList');
        const baseMapsContainer = document.getElementById('baseMapsContainer');
        if (baseMapsButtonList && baseMapsContainer != null) {
            if (!baseMapsButtonList.contains(baseMapsContainer)) {
                baseMapsButtonList.append(baseMapsContainer);
            }
        }
    }, [olMap]);

    const handleClear = () => {
        toggleComponent("default");
    }

    const handleBaseMapGallery = () => {
        if (olMap) {
            toggleComponent(title);
        }
    }

    const loadBingMapLayer = (lyrType) => {

        let bingMapsSource = new BingMaps({
            key: BingMapKey,
            imagerySet: lyrType,
        });

        const bingMapsLayer = new TileLayer({
            source: bingMapsSource,
        });

        if (olMap != undefined) {
            addLayerToMap(bingMapsLayer);
        }
    };

    const loadingOSM = () => {
        if (olMap) {
            var lyr = new TileLayer({
                title: 'OSM',
                type: 'base',
                visible: true,
                source: new OSM(),
            });
            addLayerToMap(lyr);
        }
    };

    const loadGebcoMap = () => {
        if (olMap) {
            const gebcoLayer = new TileLayer({
                source: new TileWMS({
                    url: GebcoUrl,
                    params: {
                        'LAYERS': 'GEBCO_LATEST',
                        'FORMAT': 'image/png',
                        'TRANSPARENT': true
                    }
                })
            });
            addLayerToMap(gebcoLayer);
        }
    }

    const addLayerToMap = (lyr) => {
        const layers = olMap.getLayers().getArray();
        if (layers.length > 0) {
            olMap.removeLayer(layers[0]);
        }
        olMap.getLayers().insertAt(0, lyr);
    };

    return (
        <div id='baseMapsContainer' style={{ position: "relative" }}>
            <OverlayTrigger
                trigger="click"
                key="bottom"
                placement="auto"
                className="w-75 position-absolute"
                show={isBaseMapWindowButtonVisible}
                overlay={
                    <StyledPopover style={{
                        width: '400px',
                        height: 'auto',
                    }}>
                        <Popover.Header as="h6" className='d-flex justify-content-between align-items-center pe-2' style={{ color: textColor, backgroundColor: backgroundColor, borderColor: borderColor }}>
                            <i className="bi bi-map me-2"></i>
                            Map Gallery
                            <CloseButton
                                onClick={handleClear}
                                className='ms-auto'
                            ><i className='bi bi-x'></i>
                            </CloseButton>
                        </Popover.Header>
                        <Popover.Body>
                            <div className='d-flex flex-wrap'>
                                {imageArray.map((image, index) => (
                                    <Card key={index} className='m-1' onClick={image.onClick} style={{ cursor: 'pointer', borderColor: borderColor, width: '30%' }}>
                                        <Card.Img variant='top'
                                            src={image.src}
                                            width={imgWidth}
                                            height={imgHeight}
                                            title={image.title}
                                            alt={image.title}
                                        />
                                        <Card.Body className='p-1'>
                                            <Card.Text style={{ color: typoColor }}>{image.title}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        </Popover.Body>
                    </StyledPopover>
                }
            >
                <StyledMapControlButton title={title} id={title}
                    className='p-1 mb-1'
                    onClick={handleBaseMapGallery}
                    active={isBaseMapButtonActive === title}
                >
                    <i className="bi bi-map" />
                </StyledMapControlButton>
            </OverlayTrigger >
        </div>
    )
}

export default BaseMaps;