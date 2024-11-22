import React, { useContext, useEffect, useState } from 'react';
import { StyledMapControlButton } from '../../../Reusable/StyledComponent';
import { OLMapContext } from '../../../../Context/OlMapContext';
import { useUtility } from '../../../../Context/UtilityContext';

function ZoomOut() {

    const [title] = useState('ZoomOut');
    const { olMap, updatePreviousExtend } = useContext(OLMapContext);
    const { toggleComponent, isZoomOutButtonActive } = useUtility();

    useEffect(() => {
        var zoomOutButtonList = document.getElementById('zoomOutButtonList');
        const zoomOutContainer = document.getElementById('zoomOutContainer');
        if (zoomOutButtonList && zoomOutContainer) {
            if (!zoomOutButtonList.contains(zoomOutContainer)) {
                zoomOutButtonList.append(zoomOutContainer);
            }
        }
    }, [olMap]);

    const handleZoomOut = (e) => {
        if (olMap) {
            toggleComponent(title);
            const view = olMap.getView();
            let currentZoom = view.getZoom();
            olMap.getView().setZoom(currentZoom - 0.5);
            updatePreviousExtend();
        }
    }

    return (
        <div id='zoomOutContainer' style={{ position: "relative" }}>
            <StyledMapControlButton title={title} id={title}
                className={`p-1 mb-1 ${isZoomOutButtonActive ? 'active' : ''}`}
                onClick={handleZoomOut}
            >
                <i className="bi bi-zoom-out" />
            </StyledMapControlButton>
        </div>
    )
}

export default ZoomOut;