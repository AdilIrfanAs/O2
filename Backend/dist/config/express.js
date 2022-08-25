"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const method_override_1 = __importDefault(require("method-override"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_bearer_token_1 = __importDefault(require("express-bearer-token"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const auth_1 = __importDefault(require("../api/middlewares/front/auth"));
const index_1 = __importDefault(require("../api/routes/v1/front/index"));
const error_1 = __importDefault(require("../api/middlewares/error"));
const crypto_js_1 = __importDefault(require("crypto-js"));
/**
* Express instance
* @public
*/
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use((0, express_bearer_token_1.default)());
app.use((0, method_override_1.default)());
const apiRequestLimiterAll = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 90000
});
app.use(function (req, res, next) {
    console.log(req.headers);
    if (req.method == 'POST' || req.method == 'PUT' || req.method == 'DELETE') {
        console.log("==== req.headers.authorization ====");
        console.log(req.headers.authorization);
        if (!req.headers.authorization) {
            return res.status(403).json({ error: 'No credentials sent!' });
        }
        else {
            // Decrypt
            var bytes = crypto_js_1.default.AES.decrypt(req.headers.authorization, `${process.env.CLIENT_ENCRYPTION_KEY}`);
            var CLIENT_SECRET = bytes.toString(crypto_js_1.default.enc.Utf8);
            console.log("==== CLIENT_SECRET ====");
            console.log(CLIENT_SECRET);
            if (!(CLIENT_SECRET == `${process.env.CLIENT_SECRET_KEY}`)) {
                return res.status(402).json({ error: 'Invalid token!' });
            }
        }
    }
    next();
});
app.use("/v1/", apiRequestLimiterAll);
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use((0, cors_1.default)(corsOptions));
// compress all responses
app.use((0, compression_1.default)());
// mount admin api v1 routes
// app.use('/v1/admin', adminRoutes);
// authentication middleware to enforce authentication and authorization
app.use(auth_1.default.userValidation);
// authentication middleware to get token
// app.use(frontAuth.authenticate);
// mount admin api v1 routes
app.use('/v1/front', index_1.default);
app.use('/uploads/', express_1.default.static('uploads'));
// Admin Site Build Path
app.use('/admin/', express_1.default.static(path_1.default.join(__dirname, '../../admin')));
app.get('/admin/*', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, '../../admin', 'index.html'));
});
// Front Site Build Path
app.use('/', express_1.default.static(path_1.default.join(__dirname, '../../client')));
app.get('/*', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, '../../client', 'index.html'));
});
// if error is not an instanceOf APIError, convert it.
app.use(error_1.default.converter);
// catch 404 and forward to error handler
app.use(error_1.default.notFound);
// error handler, send stacktrace only during development
app.use(error_1.default.handler);
exports.default = app;
