import React, { useState } from 'react';
import { Accordion, Tabs, Tab } from 'react-bootstrap';
import ColorProperties from './ColorProperties/ColorProperties';
import ComponentConfig from './ComponentConfig/ComponentConfig';
import LayerConfig from './LayerConfig/layerConfig';
import { S128WidgetList, S124WidgetList, S102WidgetsList, MapWidgetList } from '../../../../DroppedComponents';
import WidgetList from './WidgetList';
//import LogoConfig from '../Dashboard/LogoConfig/LogoConfig';

function SidebarTabs() {

    const [selectedTab, setSelectedTab] = useState("widgets");

    const handleTabSelect = (tabKey) => {
        setSelectedTab(tabKey);
    };

    const [activeKey, setActiveKey] = useState(0);

    const handleAccordionClick = (eventKey) => {
        setActiveKey(activeKey === eventKey ? null : eventKey);
    };

    const accordionItems = [
        {
            eventKey: "0",
            header: "Geo Spatial",
            body: <WidgetList widgetList={MapWidgetList} />,
        },
        {
            eventKey: "1",
            header: "S-128 Catalogue of Nautical Products",
            body: <WidgetList widgetList={S128WidgetList} />,
        },
        {
            eventKey: "2",
            header: "S-124 Navigational Warnings",
            body: <WidgetList widgetList={S124WidgetList} />,
        },
        {
            eventKey: "3",
            header: "S-102 Bathymetric Surface",
            body: <WidgetList widgetList={S102WidgetsList} />,
        },
    ];

    return (
        <Tabs
            activeKey={selectedTab}
            onSelect={handleTabSelect}
            id="uncontrolled-tab-example"
            fill
            className='BuilderSidebarTabs'
        >
            <Tab eventKey="widgets" title="Widgets">
                <Accordion defaultActiveKey="0" className='BuilderSidebarAccordion'>
                    {accordionItems.map((item) => (
                        <Accordion.Item key={item.eventKey} eventKey={item.eventKey} className='border-0'>
                            <Accordion.Header>{item.header}</Accordion.Header>
                            <Accordion.Body className='rounded-4 p-2'>
                                {item.body}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Tab>
            <Tab eventKey="properties" title="Properties">
                <ColorProperties />
            </Tab>
            <Tab eventKey="dashboard" title="Dashboard">
                <Accordion activeKey={activeKey} onSelect={handleAccordionClick} className='BuilderSidebarAccordion'>
                    <Accordion activeKey={activeKey} onSelect={handleAccordionClick} className='BuilderSidebarAccordion'>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Components</Accordion.Header>
                            <Accordion.Body className='p-2 rounded-4'>{"0" === activeKey && <ComponentConfig />}</Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Layers</Accordion.Header>
                            <Accordion.Body className='p-2 rounded-4'>{"1" === activeKey && <LayerConfig />}</Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>LogoConfig</Accordion.Header>
                            {/* <Accordion.Body className='p-2 rounded-4'>{"3" === activeKey && <LogoConfig></LogoConfig>}</Accordion.Body> */}
                        </Accordion.Item>
                    </Accordion>
                </Accordion>
            </Tab>
        </Tabs>
    );
}

export default SidebarTabs;