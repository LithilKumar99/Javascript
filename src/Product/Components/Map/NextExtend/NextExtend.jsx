import React, { useContext, useEffect, useState } from 'react';
import { StyledMapControlButton } from '../../../Reusable/StyledComponent';
import { OLMapContext } from '../../../../Context/OlMapContext';
import { useUtility } from '../../../../Context/UtilityContext';

function NextExtend() {

    const [title] = useState('NextExtend');
    const { olMap, isNextExtend, updatePreviousExtend } = useContext(OLMapContext);
    const { toggleComponent, isNextExtendButtonActive } = useUtility();

    useEffect(() => {
        var nextExtendButtonList = document.getElementById('nextExtendButtonList');
        const nextExtendContainer = document.getElementById('nextExtendContainer');

        if (nextExtendButtonList && nextExtendContainer != null) {
            if (!nextExtendButtonList.contains(nextExtendContainer)) {
                nextExtendButtonList.append(nextExtendContainer);
            }
        }

    }, [olMap]);

    const handleNextExtend = () => {
        if (olMap) {
            toggleComponent(title);
            var extent = isNextExtend.pop();
            if (extent) {
                olMap.getView().fit(extent);
                updatePreviousExtend();
            }
        }
    }

    return (
        <div id='nextExtendContainer' style={{ position: "relative" }}>
            <StyledMapControlButton title={title} id={title}
                className={`p-1 mb-1 ${isNextExtendButtonActive ? 'active' : ''}`}
                onClick={handleNextExtend}
            >
                <i className="bi bi-box-arrow-in-up-right" />
            </StyledMapControlButton>
        </div>
    )
}

export default NextExtend;