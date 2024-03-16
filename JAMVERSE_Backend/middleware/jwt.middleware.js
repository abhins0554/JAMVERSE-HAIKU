const { verify } = require("../utils/helpers/jwt.service");

const ErrorResponse = require('../utils/helpers/ErrorResponse');

class AuthMiddlewareService {
    async authenticate(req, res, next) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return next(new ErrorResponse('Invalid token', 401));
        const accessToken = authHeader && authHeader?.split(' ')[1];
        if (!accessToken) return next(new ErrorResponse('Invalid token', 401));
        try {
            let userData = JSON.parse(await verify(accessToken));
            if (userData && userData._id) {
                if (userData) {
                    req.decoded = userData;
                    return next();
                } else {
                    return next(new ErrorResponse('Invalid token', 401));
                }
            } else {
                return next(new ErrorResponse('Invalid token or expired token', 401));
            }
        } catch (err) {
            return next(err);
        }
    }

}

module.exports = new AuthMiddlewareService();
