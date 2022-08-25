"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDefaultImage = exports.siteUrl = exports.mongo = exports.jwtExpirationInterval = exports.pwdSaltRounds = exports.pwEncryptionKey = exports.port = exports.env = void 0;
require('dotenv').config();
let object = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    pwEncryptionKey: process.env.PW_ENCRYPTION_KEY,
    pwdSaltRounds: process.env.PWD_SALT_ROUNDS,
    jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
    mongo: {
        uri: process.env.MONGO_URI,
    },
    siteUrl: process.env.SITE_URL,
    userDefaultImage: '/img/placeholder.png',
};
exports.env = object.env, exports.port = object.port, exports.pwEncryptionKey = object.pwEncryptionKey, exports.pwdSaltRounds = object.pwdSaltRounds, exports.jwtExpirationInterval = object.jwtExpirationInterval, exports.mongo = object.mongo, exports.siteUrl = object.siteUrl, exports.userDefaultImage = object.userDefaultImage;
