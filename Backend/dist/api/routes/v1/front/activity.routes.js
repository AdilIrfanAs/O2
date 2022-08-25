"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const activity_controller_1 = require("../../../controllers/front/activity.controller");
const router = express_1.default.Router();
router.route('/').get(activity_controller_1.list);
router.route('/find').get(activity_controller_1.find);
exports.default = router;
