import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './Builder/HomePage/Home.jsx';
import MainLayout from './Builder/MainLayout/MainLayout';
import { OLMapProvider } from './Context/OlMapContext.jsx';
import { BuilderProvider } from './Builder/Context/BuilderProvider.jsx';
import PreviewDesignLayout from './Builder/MainLayout/Components/PreviewDesignLayout/PreviewDesignLayout.jsx';
import { ColorProvider } from './Context/ColorContext.jsx';
import './index.css';
import { isBuilder } from './Utils/AppDetails.jsx';
import { useEffect } from 'react';
import { UtilityProvider } from './Context/UtilityContext.jsx';
import OlMapPreviewProvider from './Product/Components/Map/LayerConfig/MapPreview/MapPreviewContext.jsx';
import { ProductFilterProvider } from './Product/Components/S-128/ProductFilter/Context/ProductFilterContext.jsx';
import { RTZFileProvider } from './Product/Components/S-128/ProductFilter/Context/RTZFileContext.jsx';
import Dashboard from './Product/Components/S-128/Dashboard/Dashboard.jsx';
import { S128_AttributeQuery_Provider } from './Product/Components/S-128/AttributeQuery/Context/AttributeQueryContext.jsx';
import LocalAreaMapPreviewProvider from './Product/Components/S-124/Dashboard/Components/LocalAreas/MapPreview/MapPreviewContext.jsx';

function App() {

  useEffect(() => {
    if (isBuilder) {
      document.title = 'IIC APP Builder';
    }
  }, [])

  return (<>
    <BuilderProvider>
      <ColorProvider>
        <OLMapProvider>
          <UtilityProvider>
            <OlMapPreviewProvider>
              <LocalAreaMapPreviewProvider>
                <S128_AttributeQuery_Provider>
                  <ProductFilterProvider>
                    <RTZFileProvider>
                      <Router>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/mainLayout/:projectName/:projectId" element={<MainLayout />} />
                          <Route path="/userDashboard/:projectName/:projectId" element={<Dashboard />} />
                          <Route path="/S124UserDashboard/:projectName/:projectId" element={<Dashboard />} />
                          <Route path="/preview/:projectName/:projectId" element={<PreviewDesignLayout />} />
                        </Routes>
                      </Router>
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
                    </RTZFileProvider>
                  </ProductFilterProvider>
                </S128_AttributeQuery_Provider>
              </LocalAreaMapPreviewProvider>
            </OlMapPreviewProvider>
          </UtilityProvider>
        </OLMapProvider>
      </ColorProvider>
    </BuilderProvider>
  </>
  )
}
export default App
