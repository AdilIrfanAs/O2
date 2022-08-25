import express from 'express';
import { list, find } from '../../../controllers/front/activity.controller';
const router = express.Router();

router.route('/').get(list)
router.route('/find').get(find)

export default router;