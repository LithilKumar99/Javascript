import React from 'react';
import { S128WidgetList, S124WidgetList, S102WidgetsList, MapWidgetList } from '../../DroppedComponents.jsx';

const RenderComponents = ({ draggedComponents }) => {
    return <div>
        {draggedComponents && draggedComponents.map((component, index) => {
            if (component == 'Map') {
                component = 'OlMap';
            }
            return <div key={index}>
                {MapWidgetList.find(widget => widget.widget === component)?.component}
                {S102WidgetsList.find(widget => widget.widget === component)?.component}
                {S128WidgetList.find(widget => widget.widget === component)?.component}
                {S124WidgetList.find(widget => widget.widget === component)?.component}
            </div>
        })}
    </div>;
};

export default RenderComponents;
