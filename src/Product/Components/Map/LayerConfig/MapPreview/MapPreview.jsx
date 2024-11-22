import React, { useEffect, useRef, useContext } from 'react';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { OlMapPreviewContext } from './MapPreviewContext';
import './MapPreview.css';

function MapPreview() {

    const { map } = useContext(OlMapPreviewContext);
    const mapRef = useRef();

    useEffect(() => {

        if (map) {
            var view = new View({
                center: [0, 0],
                zoom: 1,
            });
            var lyr = new TileLayer({
                title: 'OSM',
                type: 'base',
                visible: true,
                source: new OSM(),
            });

            map.setView(view);
            map.addLayer(lyr);
            map.setTarget(mapRef.current);

            map.on('loadstart', function () {
                map.getTargetElement().classList.add('spinner');
            });
            map.on('loadend', function () {
                map.getTargetElement().classList.remove('spinner');
            });
        }

    }, [map])

    return (
        <>
            <div ref={mapRef} id="mapPreviewcontainer" className="mapPreviewcontainer shadow border" >
            </div>
        </>
    )
}
export default MapPreview;



