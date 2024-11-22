import React, { useContext, useEffect, useState } from 'react';
import { StyledMapControlButton } from '../../../Reusable/StyledComponent';
import { OLMapContext } from '../../../../Context/OlMapContext';
import { useUtility } from '../../../../Context/UtilityContext';

function ZoomIn() {

    const [title] = useState('ZoomIn');
    const { olMap, updatePreviousExtend } = useContext(OLMapContext);
    const { toggleComponent, isZoomInButtonActive } = useUtility();

    useEffect(() => {
        var zoomInButtonList = document.getElementById('zoomInButtonList');
        const zoomInContainer = document.getElementById('zoomInContainer');
        if (zoomInButtonList && zoomInContainer != null) {
            if (!zoomInButtonList.contains(zoomInContainer)) {
                zoomInButtonList.appendChild(zoomInContainer);
            }
        }
    }, [olMap]);

    const handleZoomIn = (e) => {
        if (olMap) {
            toggleComponent(title);
            updatePreviousExtend();
            const view = olMap.getView();
            let currentZoom = view.getZoom();
            olMap.getView().setZoom(currentZoom + 0.5);
        }
    }

    return (
        <div id='zoomInContainer' style={{ position: "relative" }}>
            <StyledMapControlButton title={title} id={title}
                className={`p-1 mb-1 ${isZoomInButtonActive ? 'active' : ''}`}
                onClick={handleZoomIn}
            >
                <i className="bi bi-zoom-in" />
            </StyledMapControlButton>
        </div>
    )
}

export default ZoomIn;