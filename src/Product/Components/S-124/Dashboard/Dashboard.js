import Template from "./Components/Templates/Template";
import FeatureCatalogue from "./Components/FeatureCatalogue/FeatureCatalogue";
import WarningTypes from "./Components/WarningTypes/WarningTypes";
import GeneralTypes from "./Components/GeneralTypes/GeneralTypes";
import TypesDetails from "./Components/TypesDetails/TypesDetails";
import Categories from "./Components/Categories/Categories";
import Relation from "./Components/Relation/Relation";
import LocalArea from "./Components/LocalAreas/LocalArea";
import UsersMain from "./Components/Users/UsersMain";

export const sidebarItems = [
    {
        eventKey: "Users",
        icon: "bi bi-person",
        label: "Users",
        component: UsersMain
    },
    {
        eventKey: "featureCatalogue",
        icon: "bi bi-list-task",
        label: "Feature Catalogue",
        component: FeatureCatalogue
    },
    {
        eventKey: "WarningTypes",
        icon: "bi bi-exclamation-circle",
        label: "Warning Types",
        component: WarningTypes
    },
    {
        eventKey: "GeneralTypes",
        icon: "bi bi-tags",
        label: "General Types",
        component: GeneralTypes
    },
    {
        eventKey: "TypesDetails",
        icon: "bi bi-info-circle",
        label: "Types Details",
        component: TypesDetails
    },
    {
        eventKey: "Categories",
        icon: "bi bi-collection",
        label: "Categories",
        component: Categories
    },
    {
        eventKey: "Relation",
        icon: "bi bi-link",
        label: "Relation",
        component: Relation
    },
    {
        eventKey: "Templates",
        icon: "bi bi-file-earmark-code",
        label: "Templates",
        component: Template
    },
    {
        eventKey: "LocalAreas",
        icon: "bi bi-geo-alt",
        label: "Local Areas",
        component: LocalArea
    }
];