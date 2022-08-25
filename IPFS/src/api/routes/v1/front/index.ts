import express from 'express'
const router = express.Router()

import nftMetadata from './nftMetadata.routes'
router.use('/metadata', nftMetadata)

export default router;
