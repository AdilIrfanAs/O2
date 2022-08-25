import express from 'express';
import { simpleMessage } from '../../../controllers/front/unity.controller';
const router = express.Router();

router.route('/simple-message').get(simpleMessage)
router.route('/simple-message').post(simpleMessage)
router.route('/simple-message').put(simpleMessage)

export default router;