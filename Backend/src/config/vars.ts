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

export const { env, port, pwEncryptionKey, pwdSaltRounds, jwtExpirationInterval, mongo, siteUrl, userDefaultImage } = object;
