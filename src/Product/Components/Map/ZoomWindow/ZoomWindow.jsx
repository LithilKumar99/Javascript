import React, { useContext, useEffect, useState } from 'react';
import { StyledMapControlButton } from '../../../Reusable/StyledComponent';
import DragBox from 'ol/interaction/DragBox';
import { TbZoomPan } from "react-icons/tb";
import { useUtility } from '../../../../Context/UtilityContext';
import { OLMapContext } from '../../../../Context/OlMapContext';

function ZoomWindow() {

    const [title] = useState('ZoomWindow');
    const { olMap } = useContext(OLMapContext);

    const { toggleComponent, isZoomWindowDragBoxRef, isZoomWindowButtonActive,
        toggleZoomWindowBtnFlag, isZoomWindowBtnFlag } = useUtility();

    useEffect(() => {
        var zoomWindowButtonList = document.getElementById('zoomWindowButtonList');
        const zoomWindowContainer = document.getElementById('zoomWindowContainer');

        if (zoomWindowButtonList && zoomWindowContainer != null) {
            if (!zoomWindowButtonList.contains(zoomWindowContainer)) {
                zoomWindowButtonList.append(zoomWindowContainer);
            }
        }
    }, []);

    const handleZoomWindow = () => {
        if (isZoomWindowBtnFlag == true) {
            toggleComponent(title);
            zoomWindowFunctionality();
            toggleZoomWindowBtnFlag(false);
        }
        else {
            toggleZoomWindowBtnFlag(true);
            toggleComponent("default");
        }
    }

    const zoomWindowFunctionality = () => {
        const dragBox = new DragBox({
            condition: function (event) {
                return event.type === 'pointerdown';
            },
            style: {
                stroke: {
                    color: 'rgba(0, 0, 255, 1)',
                },
                fill: {
                    color: 'rgba(0, 0, 255, 0.1)',
                },
            },
        });

        olMap.addInteraction(dragBox);
        isZoomWindowDragBoxRef.current = dragBox;

        dragBox.on('boxend', function () {
            const extent = dragBox.getGeometry().getExtent();
            olMap.getView().fit(extent, { duration: 1000 });
        });
    }

    return (
        <div id='zoomWindowContainer' style={{ position: "relative" }}>
            <StyledMapControlButton title={title} id={title}
                active={isZoomWindowButtonActive} className={`p-1 mb-1 drawBtn ${isZoomWindowButtonActive ? 'active' : ''}`}
                onClick={handleZoomWindow}
            >
                <TbZoomPan style={{ width: '24px', height: '24px', position: 'relative', bottom: '3px' }} />
            </StyledMapControlButton>
        </div>
    )
}

export default ZoomWindow;