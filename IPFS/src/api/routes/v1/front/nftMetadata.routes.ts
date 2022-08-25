import express from 'express';
import { create, get } from '../../../controllers/front/nftMetadata.controller';
const router = express.Router();

router.route('/').post(create)
router.route('/:id').get(get)

export default router;