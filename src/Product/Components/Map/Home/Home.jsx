import React, { useContext, useEffect, useState } from 'react';
import { fromLonLat } from "ol/proj.js";
import View from "ol/View";
import { useUtility } from '../../../../Context/UtilityContext';
import { StyledMapControlButton } from '../../../Reusable/StyledComponent';
import { OLMapContext } from '../../../../Context/OlMapContext';

function Home() {

    const [title] = useState('Home');
    const [center] = useState([0, 0]);
    const { olMap, updatePreviousExtend } = useContext(OLMapContext);
    const { toggleComponent, isHomeButtonActive } = useUtility();

    useEffect(() => {
        var homeButtonList = document.getElementById('homeButtonList');
        const homeContainer = document.getElementById('homeContainer');
        if (homeButtonList && olMap && homeContainer) {
            if (!homeButtonList.contains(homeContainer)) {
                homeButtonList.append(homeContainer);
            }
        }
    }, [olMap]);

    const handleHome = (e) => {
        if (olMap) {
            toggleComponent(title);
            var view = new View({
                center: fromLonLat(center),
                zoom: 2,
            });
            olMap.setView(view);
            updatePreviousExtend();
        }
    }
    return (
        <div id='homeContainer' style={{ position: "relative" }}>
            <StyledMapControlButton
                title="Zoom Extent" id={title}
                className={`p-1 mb-1 ${isHomeButtonActive ? 'active' : ''}`}
                onClick={handleHome}
            >
                <i className="bi bi-arrows-fullscreen" />
            </StyledMapControlButton>
        </div>
    )
}

export default Home;