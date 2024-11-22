import Home from "./Product/Components/Map/Home/Home";
import Mouse_Position from "./Product/Components/Map/MousePosition/MousePosition";
import NextExtend from "./Product/Components/Map/NextExtend/NextExtend";
import OlMap from "./Product/Components/Map/OlMap/OlMap";
import OverView from "./Product/Components/Map/OverView/OverView";
import PreviousExtend from "./Product/Components/Map/PreviousExtend/PreviousExtend";
import Scale from "./Product/Components/Map/Scale/Scale";
import ZoomIn from "./Product/Components/Map/ZoomIn/ZoomIn";
import ZoomOut from "./Product/Components/Map/ZoomOut/ZoomOut";
import { TbRulerMeasure, TbZoomPan } from "react-icons/tb";
import ZoomWindow from "./Product/Components/Map/ZoomWindow/ZoomWindow";
import BaseMaps from "./Product/Components/Map/BaseMaps/BaseMaps";
import Measure from "./Product/Components/Map/Measure/Measure";
import FeatureInfo from "./Product/Components/Map/FeatureInfo/FeatureInfo";
import LayerSwitcher from "./Product/Components/Map/LayerSwitcher/LayerSwitcher";
import DepthFilter from "./Product/Components/S-102/DepthFilter";
import LayerConfig from "./Product/Components/Map/LayerConfig/LayerConfig";
import AttributeQuery from "./Product/Components/S-128/AttributeQuery/AttributeQuery";
import ProductFilter from "./Product/Components/S-128/ProductFilter/ProductFilter";
import Cart from "./Product/Components/S-128/Cart/Cart";
import User from "./Product/Components/S-128/Dashboard/Authentication/User";
import S124User from "./Product/Components/S-124/Dashboard/Authentication/User";

export const MapWidgetList = [
    {
        widget: "OlMap",
        title: "Map",
        icon: <i className="bi bi-map"></i>,
        path: '/Product/Components/Map/OlMap/OlMap',
        component: <OlMap key="Map" />
    },
    {
        widget: "Home",
        title: "Zoom Extent",
        icon: <i className="bi bi-arrows-fullscreen"></i>,
        path: '/Product/Components/Map/Home/Home',
        component: <Home key="Home" />
    },
    {
        widget: "ZoomIn",
        title: "Zoom in",
        icon: <i className="bi bi-zoom-in"></i>,
        path: '/Product/Components/Map/ZoomIn/ZoomIn',
        component: <ZoomIn key="ZoomIn" />
    },
    {
        widget: "ZoomOut",
        title: "Zoom out",
        icon: <i className="bi bi-zoom-out"></i>,
        path: '/Product/Components/Map/ZoomOut/ZoomOut',
        component: <ZoomOut key="ZoomOut" />
    },
    {
        widget: "PreviousExtend",
        title: "Previous extend",
        icon: <i className="bi bi-box-arrow-in-up-left"></i>,
        path: '/Product/Components/Map/PreviousExtend/PreviousExtend',
        component: <PreviousExtend key="PreviousExtend" />
    },
    {
        widget: "NextExtend",
        title: "Next extend",
        icon: <i className="bi bi-box-arrow-in-up-right"></i>,
        path: '/Product/Components/Map/NextExtend/NextExtend',
        component: <NextExtend key="NextExtend" />
    },
    {
        widget: "MousePosition",
        title: "Mouse position",
        icon: <i className="bi bi-mouse2-fill"></i>,
        path: '/Product/Components/Map/MousePosition/MousePosition',
        component: <Mouse_Position key="MousePosition" />
    },
    {
        widget: "Scale",
        title: "Scale",
        icon: <i className="bi bi-rulers"></i>,
        path: '/Product/Components/Map/Scale/Scale',
        component: <Scale key="Scale" />
    },
    {
        widget: "OverView",
        title: "Overview",
        icon: <i className="bi bi-eye"></i>,
        path: '/Product/Components/Map/OverView/OverView',
        component: <OverView key="OverView" />
    },
    {
        widget: "ZoomWindow",
        title: "Zoom window",
        icon: <TbZoomPan style={{ width: '20px', height: '22px', position: 'relative', bottom: '3px', left: '-3px' }} />,
        path: '/Product/Components/Map/ZoomWindow/ZoomWindow',
        component: <ZoomWindow key="ZoomWindow" />
    },
    {
        widget: "BaseMaps",
        title: "Base maps",
        icon: <i className="bi bi-map"></i>,
        path: '/Product/Components/Map/BaseMaps/BaseMaps',
        component: <BaseMaps key="BaseMaps" />
    },
    {
        widget: "Measure",
        title: "Measure",
        icon: <TbRulerMeasure style={{ width: '20px', height: '22px', position: 'relative', bottom: '3px', left: '-3px' }} />,
        path: '/Product/Components/Map/Measure/Measure',
        component: <Measure key="Measure" />
    },
    {
        widget: "FeatureInfo",
        title: "Feature Information",
        icon: <i className="bi bi-info-circle" />,
        path: '/Product/Components/Map/FeatureInfo/FeatureInfo',
        component: <FeatureInfo key="FeatureInfo" />
    },
    {
        widget: "LayerSwitcher",
        title: "Layer switcher",
        icon: <i className="bi bi-layers" />,
        path: '/Product/Components/Map/LayerSwitcher/LayerSwitcher',
        component: <LayerSwitcher key="LayerSwitcher" />
    },
    {
        widget: "LayerConfig",
        title: "Layer config",
        icon: <i className="bi bi-layers" />,
        path: '/Product/Components/Map/LayerConfig/LayerConfig',
        component: <LayerConfig key="LayerConfig" />
    },

];

export const S128WidgetList = [
    {
        widget: "AttributeQuery",
        title: "Attribute Query",
        icon: <i className="bi bi-filter" />,
        path: '/Product/Components/OSC/AttributeQuery/AttributeQuery',
        component: <AttributeQuery key="AttributeQuery" />
    },
    {
        widget: "ProductFilter",
        title: "Product filter",
        icon: <i className="bi bi-funnel"></i>,
        path: '/Product/Components/OSC/ProductFilter/ProductFilter',
        component: <ProductFilter key='ProductFilter' />
    },
    {
        widget: "Cart",
        title: "Cart",
        icon: <i className="bi bi-cart3"></i>,
        path: '/Product/Components/OSC/Cart/Cart',
        component: <Cart key="Cart" />
    },
    {
        widget: "S128User",
        title: "User profile",
        icon: <i className="bi bi-person-circle"></i>,
        path: '/Product/Components/S-128/Dashboard/Authentication/User',
        component: <User key="User" />
    },
]

export const S124WidgetList = [
    {
        widget: "AttributeQuery",
        title: "Attribute Query",
        icon: <i className="bi bi-filter" />,
        path: '',
        component: ''
    },
    {
        widget: "S124NavigationalWarnings",
        title: "S124 Navigational Warnings",
        icon: <i className="bi bi-funnel"></i>,
        path: '',
        component: ''
    },

    {
        widget: "S124User",
        title: "User profile",
        icon: <i className="bi bi-person-circle"></i>,
        path: '/Product/Components/S-124/Dashboard/Authentication/User',
        component: <S124User key="S124User" />
    },
]

export const S102WidgetsList = [
    {
        widget: "DepthFilter",
        title: "Depth Filter",
        icon: <i className="bi bi-filter"></i>,
        path: '/Product/Components/DepthFilter/DepthFilter',
        component: <DepthFilter key="depthFilter" />
    }
]

export const GeneralwidgetList = [

]