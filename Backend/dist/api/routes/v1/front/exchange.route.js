"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exchange_controller_1 = require("../../../controllers/front/exchange.controller");
const router = express_1.default.Router();
router.route('/').post(exchange_controller_1.create);
router.route('/').get(exchange_controller_1.list);
router.route('/:id').get(exchange_controller_1.get);
exports.default = router;
