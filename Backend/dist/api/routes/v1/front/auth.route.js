"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_controller_1 = require("../../../controllers/front/auth.controller");
router.route('/register').post(auth_controller_1.register);
router.route('/login').post(auth_controller_1.login);
router.route('/forgot-password').post(auth_controller_1.forgotPassword);
router.route('/reset-password').post(auth_controller_1.resetPassword);
router.route('/discord-login').get(auth_controller_1.discordLogin);
router.route('/discord-callback').get(auth_controller_1.discordCallback);
exports.default = router;
