export const calculateMapHeight = (draggedComponents, isBuilder) => {

    const hasHeader = draggedComponents.some(component => component === 'Header');
    const hasFooter = draggedComponents.some(component => component === 'Footer');
    const headerHeight = hasHeader ? 72 : 0;
    const footerHeight = hasFooter ? 57 : 0;
    const builderHeight = isBuilder ? 60 : 0;
    const viewportHeight = window.innerHeight - 1;

    let mapHeight;

    if (isBuilder) {
        if (!hasHeader && !hasFooter) {
            mapHeight = viewportHeight - builderHeight;
        } else if (!hasHeader && hasFooter) {
            mapHeight = viewportHeight - builderHeight - footerHeight;
        } else if (hasHeader && !hasFooter) {
            mapHeight = viewportHeight - builderHeight - headerHeight;
        }
    } else {
        if (!hasHeader && !hasFooter) {
            mapHeight = viewportHeight;
        } else if (!hasHeader && hasFooter) {
            mapHeight = viewportHeight - footerHeight;
        } else if (hasHeader && !hasFooter) {
            mapHeight = viewportHeight - headerHeight;
        } else if (hasHeader && hasFooter) {
            mapHeight = viewportHeight - headerHeight - footerHeight;
        }
    }

    return mapHeight;
};
