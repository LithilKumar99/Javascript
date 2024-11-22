import React, { useContext, useEffect } from 'react';
import { OLMapContext } from '../../../../Context/OlMapContext';
import ScaleLine from "ol/control/ScaleLine";
import './Scale.css';

function Scale() {

    const { olMap } = useContext(OLMapContext);

    useEffect(() => {

        if (olMap) {
            const scaleControl = new ScaleLine({
                units: 'metric',
                bar: true,
                steps: 4,
                text: true,
                minWidth: 120,
            });

            olMap.addControl(scaleControl);

            let scaleButtonList = document.getElementById('scaleButtonList');
            const scalebar = document.querySelector('.ol-scale-bar');

            if (scaleButtonList && scalebar) {
                scaleButtonList.appendChild(scalebar);
            }
        }

    }, [olMap]);

}

export default Scale;
