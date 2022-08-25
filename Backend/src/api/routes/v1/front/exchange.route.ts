import express from 'express';
import { create, list, get } from '../../../controllers/front/exchange.controller';
const router = express.Router();

router.route('/').post(create)
router.route('/').get(list)
router.route('/:id').get(get)

export default router;