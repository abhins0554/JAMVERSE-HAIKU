import { makeUnauthorizedRequest } from './Client';

const loginService = (data) => {
    return makeUnauthorizedRequest('POST', '/auth/login', data);
}

const signupService = (data) => {
    return makeUnauthorizedRequest('POST', '/auth/signup', data);
}

const googleSignupService = (data) => {
    return makeUnauthorizedRequest('POST', '/auth/signup-google', data);
}

const googleLoginService = (data) => {
    return makeUnauthorizedRequest('POST', '/auth/login-google', data);
}

const forgotPasswordService = (params) => {
    return makeUnauthorizedRequest('GET', '/auth/forgot-password' + params);
}

const validateOTPService = (params) => {
    return makeUnauthorizedRequest('GET', '/auth/validate-otp-password' + params);
}

export default { loginService, signupService, googleLoginService, googleSignupService, forgotPasswordService, validateOTPService };