"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const unity_controller_1 = require("../../../controllers/front/unity.controller");
const router = express_1.default.Router();
router.route('/simple-message').get(unity_controller_1.simpleMessage);
router.route('/simple-message').post(unity_controller_1.simpleMessage);
router.route('/simple-message').put(unity_controller_1.simpleMessage);
exports.default = router;
