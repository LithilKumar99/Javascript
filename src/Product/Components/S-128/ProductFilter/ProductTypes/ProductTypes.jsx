import React, { useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { S1412windLayer } from '../../config'
import { useProductFilter } from '../Context/ProductFilterContext';
import { OLMapContext } from '../../../../../Context/OlMapContext';
import { StyledButton } from '../../../../Reusable/StyledComponent';
import { nodeServerUrl } from '../../../../../appConfig';

function ProductTypes() {

    const { olMap } = useContext(OLMapContext);

    const { productTypes, selectedCountry, selectedAgencyCode,
        productTypeFlag, updateProductTypeFlag,
        selectedMapLayer, updateIsLoading, updateSelectedProductTypes,
        selectedProductTypes, bands, activeUsageBandsCheckBox,
        updateBands, getQueryLayerUrl, deactiveGeometryBtns } = useProductFilter();

    const getNavUsageBands = async (layerName, agencyCode, countryCode, productType) => {
        let usageBands = [];
        const geoserverQueryLayerUrl = getQueryLayerUrl(layerName, olMap);
        const propertyName = 'navusage';
        const outputFormat = 'application/json';
        const cqlFilter = `producercode='${agencyCode}' AND country_code='${countryCode}' AND producttype='${productType}'`;
        const baseUrl = `${geoserverQueryLayerUrl}?service=WFS&version=1.1.0&request=GetFeature&typename=${layerName}&outputFormat=${outputFormat}&cql_filter=${encodeURIComponent(cqlFilter)}&propertyName=${propertyName}`;
        const queryParams = { param: baseUrl };

        try {
            const fetchedNavUsages = await axios.get(`${nodeServerUrl}/getDetails`, { params: queryParams });
            const features = fetchedNavUsages?.data;
            if (features) {
                const navUsages = features.features.map(feature => feature.properties.navusage);
                usageBands = Array.from(new Set(navUsages)).map(navUsage => {
                    const foundBand = bands.find(item => item.band === navUsage);
                    return {
                        band: navUsage,
                        value: foundBand ? foundBand.value : '',
                        selected: true
                    };
                });
            } else {
                toast.warn(`There are no navusage available in GeoServer for this ${layerName}`);
            }
        } catch (error) {
            console.error('Fetching error for navusage from GeoServer for this:', error);
            toast.warn(`Fetching error for navusage from GeoServer for this ${layerName}`);
        }

        console.log(usageBands)

        usageBands.sort((a, b) => parseInt(a.band) - parseInt(b.band));

        return usageBands;
    };

    const handleProductTypeClick = async (productType) => {

        const productTypeBtn = document.getElementById(productType);
        if (productTypeBtn != null && productTypeFlag === true) {
            productTypeBtn.classList.add('active');
            updateProductTypeFlag(false);
        } else {
            updateProductTypeFlag(true);
            productTypeBtn.classList.remove('active');
        }

        updateIsLoading(true);

        const navUsageBands = await getNavUsageBands(selectedMapLayer, selectedAgencyCode, selectedCountry, productType);

        if (navUsageBands) {
            updateBands(navUsageBands);
        }
        else {
            toast.warn(`No nav bands are available for ${productType}`)
        }

        deactiveGeometryBtns();
        updateIsLoading(false);
        activeUsageBandsCheckBox();
        updateSelectedProductTypes([]);

        if (selectedProductTypes.includes(productType)) {
            updateSelectedProductTypes(
                selectedProductTypes.filter(type => type !== productType)
            );
        } else {
            updateSelectedProductTypes([...selectedProductTypes, productType]);
        }
    }

    return (
        <div>
            {selectedMapLayer !== S1412windLayer && productTypes.length > 0 &&
                productTypes.map((productType, index) => {
                    return (
                        <StyledButton key={index} className={`mt-3`} onClick={() => handleProductTypeClick(productType)} id={productType}>{productType}</StyledButton>
                    );
                })}
        </div>
    )
}

export default ProductTypes