export const S1412windLayer = 'S-1412';
export const s128ApiUrl = 'http://14.142.106.210:8080';

const BASE_URL = "http://14.142.106.210:8081/user";

export const endpoints = {

    signup: `${BASE_URL}/signup`,
    login: `${BASE_URL}/login`,
    changePassword: (queryParams) => `${BASE_URL}/changepassword?${queryParams.toString()}`,
    forgotPassword: `${BASE_URL}/forgotpassword`,
    validate: `${BASE_URL}/validate`,
};

