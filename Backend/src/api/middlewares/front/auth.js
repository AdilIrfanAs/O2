const byPassedRoutes = ['/v1/cron/conversion/rate/'];
const User = require('../../models/users.model');
const { pwEncryptionKey } = require('../../../config/vars');
const jwt = require('jsonwebtoken');

exports.userValidation = async (req, res, next) => {
    let flag = true;
    req.user = 0;
    if (req.headers['x-access-token']) {
        await jwt.verify(req.headers['x-access-token'], pwEncryptionKey, async (err, authorizedData) => {
            if (err) {
                flag = false;
                const message = 'session_expired_front_error'
                return res.send({ success: false, userDisabled: true, message, err });
            }
            else {
                req.user = authorizedData.sub;
                let user = await User.findById({ _id: req.user }).lean();
                if (!user) {
                    flag = false;
                    return res.send({ success: false, user404: true, message: 'There is no account linked to that address', notExist: 1 });
                }
            }
        })
    }
    else if (req.method.toLocaleLowerCase() !== 'options') {
        req.user = 0;
    }

    if (flag)
        next();
}
