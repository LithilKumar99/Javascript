import React, { useState, useEffect, useContext } from 'react';
import RenderComponents from '../../RenderComponents';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { calculateMapHeight } from '../../Utils/Utils';
import './PreviewDesignLayout.css';
import { OLMapContext } from '../../../../Context/OlMapContext';

function PreviewDesignLayout() {

    const { projectName } = useParams();
    document.title = projectName;
    const { updateMapHeight, updateInBuilder } = useContext(OLMapContext)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const encodedArray = queryParams.get("data");
    const arrayOfObjects = encodedArray ? JSON.parse(decodeURIComponent(encodedArray)) : [];
    const [previewDroppedComponents, setPreviewDroppedComponents] = useState([]);

    useEffect(() => {
        if (arrayOfObjects.length > 0) {
            const newList = arrayOfObjects.filter(object => object !== "LayerConfig");
            setPreviewDroppedComponents(newList);
            const height = calculateMapHeight(newList, false);
            updateMapHeight(height);
            updateInBuilder(false);
        }
    }, []);

    return (
        <div>
            <RenderComponents draggedComponents={previewDroppedComponents} />
        </div>
    )
}

export default PreviewDesignLayout;
