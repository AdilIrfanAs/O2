"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const vars_1 = require("./vars");
// set mongoose Promise to Bluebird
mongoose_1.default.Promise = Promise;
// Exit application on error
mongoose_1.default.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
});
// print mongoose logs in dev env
if (vars_1.env === 'development') {
    mongoose_1.default.set('debug', true);
}
/**
* Connect to mongo db
*
* @returns {object} Mongoose connection
* @public
*/
const connect = () => {
    mongoose_1.default.connect(vars_1.mongo.uri);
    return mongoose_1.default.connection;
};
exports.connect = connect;
