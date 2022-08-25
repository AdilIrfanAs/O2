import express from 'express'
const router = express.Router()

import authRoutes from './auth.route'
import transactionsRoutes from './transactions.route'
import exchangeRoutes from './exchange.route'
import unityRoutes from './unity.route'
import walletsRoutes from './wallets.route'
import activity from './activity.routes'
router.use('/auth', authRoutes)
router.use('/transactions', transactionsRoutes)
router.use('/exchange', exchangeRoutes)
router.use('/unity', unityRoutes)
router.use('/wallets', walletsRoutes)
router.use('/activity', activity)

export default router;
