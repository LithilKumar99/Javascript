import React, { useContext, useEffect, useState } from 'react';
import { StyledMapControlButton } from '../../../Reusable/StyledComponent';
import { OLMapContext } from '../../../../Context/OlMapContext';
import { useUtility } from '../../../../Context/UtilityContext';

function PreviousExtend() {

    const [title] = useState('PreviousExtend');
    const { olMap, isPreviousExtend, updateNextExtend } = useContext(OLMapContext);
    const { toggleComponent, isPreviousExtendButtonActive } = useUtility();

    useEffect(() => {
        var previousExtendButtonList = document.getElementById('previousExtendButtonList');
        const previousExtendContainer = document.getElementById('previousExtendContainer');
        if (previousExtendButtonList && previousExtendContainer != null) {
            if (!previousExtendButtonList.contains(previousExtendContainer)) {
                previousExtendButtonList.append(previousExtendContainer);
            }
        }
    }, [olMap]);

    const handlePreviousExtend = () => {
        if (olMap) {
            toggleComponent(title);
            var lastExtend = isPreviousExtend.pop();
            if (lastExtend) {
                olMap.getView().fit(lastExtend);
                updateNextExtend();
            }
        }
    }

    return (
        <div id='previousExtendContainer' style={{ position: "relative" }}>
            <StyledMapControlButton title={title} id={title}
                className={`p-1 mb-1 ${isPreviousExtendButtonActive ? 'active' : ''}`}
                onClick={handlePreviousExtend}
            >
                <i className="bi bi-box-arrow-in-up-left" />
            </StyledMapControlButton>
        </div>
    )
}

export default PreviousExtend;