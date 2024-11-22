
import { MapWidgetList } from "../DroppedComponents";

export const AppCodePreview = (components, projectName) => {

    if (components.length > 0) {

        var newComponents = components.map((component) => {
            if (component !== 'LayerConfig') {
                return component;
            }
        });

        const imports = newComponents.map((component) => {
            if (component === 'Map') {
                component = 'OlMap';
            }
            return `${getComponentImportPath(component)}`;
        }).join('\n');

        const componentElements = newComponents.map((component) => {
            if (component === 'Map') {
                component = 'OlMap';
            }
            if (component == 'UserProfile') {
                return `<></>`
            }
            return `<${component} />`;
        }).join('\n');

        const includeDashboardRoute = components.includes("User");
        const dashboardRoute = includeDashboardRoute
            ? `<Route path="/userDashboard/:projectName/:projectId" element={<Dashboard />} />`
            : "";
        const dashboardImport = includeDashboardRoute
            ? `import Dashboard from './Components/General/Dashboard/Dashboard';`
            : "";

        return `
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { OLMapProvider } from './Contexts/OlMapContext.jsx';
import { UtilityProvider } from './Contexts/UtilityContext.jsx';
import { ColorProvider } from './Contexts/ColorContext.jsx';
import './index.css';
import { ProductFilterProvider } from './Contexts/ProductFilterContext.jsx';
import { RTZFileProvider } from './Contexts/RTZFileContext.jsx';
import OlMapPreviewProvider from './Components/utils/MapPreview/MapPreviewContext.jsx';
${imports}
${dashboardImport}

function App() {
   document.title = '${projectName}';
    const MapComponents = () => {
        return(
          <div>
                 ${componentElements}
          </div>
        );
    };

    return (
        <>
        <ColorProvider>
            <OLMapProvider>
            <OlMapPreviewProvider>
                <UtilityProvider>
                <ProductFilterProvider>
                <RTZFileProvider>
                     <Router>
                        <Routes>
                          <Route path="/" element={<MapComponents />} />
                          <Route path="/mainLayout/:projectName/:projectId" element={<MapComponents />} />
                          ${dashboardRoute}
                        </Routes>
                     </Router>
                </RTZFileProvider>
                </ProductFilterProvider>
                </UtilityProvider>
            </OlMapPreviewProvider>
            </OLMapProvider>
        </ColorProvider>
        <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
        </>
    );
}
export default App;
        `;
    }
}

const getComponentImportPath = (component) => {
    const mapping = MapWidgetList.find(item => item.widget === component);

    if (mapping) {
        return `import ${component} from '.${mapping.path}';`;
    } else {
        return '';
    }
};

