import express from 'express';
import { signup, login, saveFavouriteNft, getFavouriteNfts } from '../../../controllers/front/wallets.controller';
const router = express.Router();

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/favouriteNft').post(saveFavouriteNft)
router.route('/favouriteNft').get(getFavouriteNfts)

export default router;