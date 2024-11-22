import React, { useContext, useEffect } from 'react';
import { OLMapContext } from '../../../../Context/OlMapContext';
import MyMousePosition from "ol/control/MousePosition";
import "./MousePosition.css";

function MousePosition() {

    const { olMap } = useContext(OLMapContext);

    useEffect(() => {

        let mapContainer = document.getElementById('map-container');
        const mousePosition = document.getElementById('mouse-position');

        if (olMap && mousePosition && mapContainer) {
            mapContainer.append(mousePosition);

            const customCoordinateFormat = function (coordinate) {
                return `Long: ${coordinate[0].toFixed(2)} Lat: ${coordinate[1].toFixed(2)}`;
            };

            const mousePositionControl = new MyMousePosition({
                coordinateFormat: customCoordinateFormat,
                projection: 'EPSG:4326',
                className: 'custom-mouse-position',
                target: mousePosition,
                undefinedHTML: 'Mouse not hovering on the map',
            });

            olMap.addControl(mousePositionControl);
        }

    }, [olMap]);

    return (
        <>
            <div id="mouse-position" className='mouse-position' ></div>
        </>
    )
}

export default MousePosition;