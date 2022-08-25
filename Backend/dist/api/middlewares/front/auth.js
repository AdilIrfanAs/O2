var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const byPassedRoutes = ['/v1/cron/conversion/rate/'];
const User = require('../../models/users.model');
const { pwEncryptionKey } = require('../../../config/vars');
const jwt = require('jsonwebtoken');
exports.userValidation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let flag = true;
    req.user = 0;
    if (req.headers['x-access-token']) {
        yield jwt.verify(req.headers['x-access-token'], pwEncryptionKey, (err, authorizedData) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                flag = false;
                const message = 'session_expired_front_error';
                return res.send({ success: false, userDisabled: true, message, err });
            }
            else {
                req.user = authorizedData.sub;
                let user = yield User.findById({ _id: req.user }).lean();
                if (!user) {
                    flag = false;
                    return res.send({ success: false, user404: true, message: 'There is no account linked to that address', notExist: 1 });
                }
            }
        }));
    }
    else if (req.method.toLocaleLowerCase() !== 'options') {
        req.user = 0;
    }
    if (flag)
        next();
});
