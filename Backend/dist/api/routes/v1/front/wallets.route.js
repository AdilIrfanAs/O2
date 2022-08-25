"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wallets_controller_1 = require("../../../controllers/front/wallets.controller");
const router = express_1.default.Router();
router.route('/signup').post(wallets_controller_1.signup);
router.route('/login').post(wallets_controller_1.login);
exports.default = router;
