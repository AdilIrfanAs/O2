import express from 'express';
const router = express.Router();
import { register, login, forgotPassword, resetPassword, discordLogin, discordCallback } from '../../../controllers/front/auth.controller';

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').post(resetPassword);
router.route('/discord-login').get(discordLogin);
router.route('/discord-callback').get(discordCallback);

export default router;