import { useEffect, useContext } from 'react';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import { OverviewMap } from 'ol/control.js';
import './OverView.css';
import { useColor } from '../../../../Context/ColorContext';
import { OLMapContext } from '../../../../Context/OlMapContext';

function OverView() {

    const { olMap } = useContext(OLMapContext);
    const { backgroundColor, textColor, borderColor } = useColor();

    useEffect(() => {
        const source = new OSM();
        const overviewMapControl = new OverviewMap({
            className: 'ol-overviewmap',
            layers: [
                new TileLayer({
                    source: source,
                }),
            ],
        });

        if (olMap) {

            olMap.addControl(overviewMapControl);

            let overViewButtonList = document.getElementById('overViewButtonList');
            const olOverviewmap = document.querySelector('.ol-overviewmap');
            if (overViewButtonList && olOverviewmap) {
                overViewButtonList.appendChild(olOverviewmap);
            }

            const style = document.createElement('style');
            style.innerHTML = `
                .ol-overviewmap button {
                  background-color: ${backgroundColor};
                  color: ${textColor};
                  border: 1px solid ${borderColor};
                  margin:0;
                  border-radius: 0.5rem !important;

                  &:hover,
                  &:focus,
                  &:active{
                    background-color: ${borderColor};
                    border-color: ${backgroundColor};
                    color: ${backgroundColor} !important;
                    box-shadow: none;
                  }
                }
              `;
            document.head.appendChild(style);

        }
    }, [olMap, backgroundColor, textColor, borderColor]);

}

export default OverView;


