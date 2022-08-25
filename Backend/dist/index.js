"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
Promise = require('bluebird');
const vars_1 = require("./config/vars");
const mongoose_1 = require("./config/mongoose");
const express_1 = __importDefault(require("./config/express"));
const http_1 = __importDefault(require("http"));
(0, mongoose_1.connect)();
http_1.default.createServer(express_1.default).listen(vars_1.port);
module.exports = express_1.default;
