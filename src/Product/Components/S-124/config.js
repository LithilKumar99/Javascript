export const s124_NavWarn_GroupLayer = 'S-124 Navigational_Warnings';
export const S124_NavWarn_NavAreas = `S-124_NavAreas`;
export const S124_NavWarn_LocalAreaLayer = `S-124_Navigational_LocalAreas`;
export const S124_NavWarn_ENCLayer = `S124 Navigational Warnings ENC`;

const S124_NavWarn_ApiUrl = `http://14.142.106.210:8088`;

export const Local_Areas = ['Area', 'Visinity'];

export const s124_NavWarn_Apis = {

    "createS124NavigationalWarning": `${S124_NavWarn_ApiUrl}/S-124`,
    "s124NavWarningFormUpdate": `${S124_NavWarn_ApiUrl}/S-124`,
    "getS124NavWarnDetails": `${S124_NavWarn_ApiUrl}/S-124`,
    "deleteS124NavigationalWarning": `${S124_NavWarn_ApiUrl}/S-124`,
    "exportfiles": (id, format) => `${S124_NavWarn_ApiUrl}/S-124/export/${id}/${format}`,
    "S124NavWarnNextWarningnumber": `${S124_NavWarn_ApiUrl}/S-124/warning-number`,
    "S124NavWarnRelation": `${S124_NavWarn_ApiUrl}/S-124/warning-information`,
    "navWarning_Enums": `${S124_NavWarn_ApiUrl}/S-124/enums`,
    "attributeQuerySearch": `${S124_NavWarn_ApiUrl}/S-124/attribute-query`,
    "attributeQueryComboBoxList": `${S124_NavWarn_ApiUrl}/S-124`,
    "productFilter_WarningTypes": `${S124_NavWarn_ApiUrl}/S-124/unique-values/warningType`,
    "productFilter_MessageTypes": `${S124_NavWarn_ApiUrl}/S-124/unique-values/messageType`,
    "productFilter_WarningNumbers": `${S124_NavWarn_ApiUrl}/S-124/unique-values/warningNumber`,
    "productFilter_Years": `${S124_NavWarn_ApiUrl}/S-124/unique-values/year`,
    "productFilter_WarningSearch": `${S124_NavWarn_ApiUrl}/S-124/search`,
    "S124MessageId": (attribute) => `${S124_NavWarn_ApiUrl}/S-124/unique-values/${attribute}`,
    "importFeatureCatalogue": `${S124_NavWarn_ApiUrl}/S-124/import/feature-catalouge`,
    "getAllfeatureCatalogueLogs": `${S124_NavWarn_ApiUrl}/S-124/logs/feature-catalogue`,
    "updateFeatureCatalogue": `${S124_NavWarn_ApiUrl}/S-124/import/feature-catalouges`,
    "addLocalArea": `${S124_NavWarn_ApiUrl}/S-124/localarea`,
    "getAllLocalAreas": `${S124_NavWarn_ApiUrl}/S-124/localareas`,
    "updateLocalArea": `${S124_NavWarn_ApiUrl}/S-124/localareas`,
    "deleteLocalArea": `${S124_NavWarn_ApiUrl}/S-124/localarea`,
    "createTemplate": `${S124_NavWarn_ApiUrl}/S-124/template`,
    "getAllTemplates": `${S124_NavWarn_ApiUrl}/S-124/templates`,
    "deleteTemplate": `${S124_NavWarn_ApiUrl}/S-124/template`,
    "updateTemplate": `${S124_NavWarn_ApiUrl}/S-124/templates`,
    "getWarningTypes": `${S124_NavWarn_ApiUrl}/S-124/details/warning_type`,
    "getTypeDetails": `${S124_NavWarn_ApiUrl}/S-124/details/type_details`,
    "getGeneralTypes": `${S124_NavWarn_ApiUrl}/S-124/details/general_type`,
    "getCategories": `${S124_NavWarn_ApiUrl}/S-124/details/category`,
    "getRelations": `${S124_NavWarn_ApiUrl}/S-124/details/relation`,
    "registerUser": `${S124_NavWarn_ApiUrl}/S-124/user/register-user`,
    "LoginUser": `${S124_NavWarn_ApiUrl}/S-124/user/login`,
    "forgotPassword": `${S124_NavWarn_ApiUrl}/S-124/user/forgot-password`,
    "changePassword": `${S124_NavWarn_ApiUrl}/S-124/user/change-password`,
    "resetPassword": `${S124_NavWarn_ApiUrl}/S-124/user/reset-password`,
    "userValidate": `${S124_NavWarn_ApiUrl}/S-124/user/validate`,
    "getAllUsers": `${S124_NavWarn_ApiUrl}/S-124/users`,
    "createUser": `${S124_NavWarn_ApiUrl}/S-124/register-user`,
    "deleteUser": `${S124_NavWarn_ApiUrl}/S-124/user`,
    "updateUser": `${S124_NavWarn_ApiUrl}/S-124/users`,
    "getAllRoles": `${S124_NavWarn_ApiUrl}/S-124/roles`,
    "createRole": `${S124_NavWarn_ApiUrl}/S-124/role`,
    "deleteRole": `${S124_NavWarn_ApiUrl}/S-124/role`,
    "updateRole": `${S124_NavWarn_ApiUrl}/S-124/roles`,
    "navigationalWarningStatus": `${S124_NavWarn_ApiUrl}/S-124/approve-navigational-warnings`,
    "getAllNavigationalWarnings": `${S124_NavWarn_ApiUrl}/S-124`,
    "importLocalAreas": (format) => `${S124_NavWarn_ApiUrl}/S-124/import/local-areas/${format}`,
}