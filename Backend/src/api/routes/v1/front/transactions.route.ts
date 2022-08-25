import express from 'express';
import { createBscTransaction, bscBalance, readBsc, createSolanaTransaction, readSolana, depositSolana, create, list, get, TransferTokensToBSCWallet, createCustomWalletSolanaTransaction, TransferTokensToSolanaWallet, createCustomWalletBscTransaction, TransferShillTokensFromBscWalletToAddress, TransferShillTokensFromSolanaWalletToAddress, getAllNfts, transferNft, transferNftTOWallet } from '../../../controllers/front/transactions.controller';
import { mintNft } from "../../../controllers/front/createNft"
const router = express.Router();

router.route('/create-bsc-transaction').post(createBscTransaction)
router.route('/read-bsc/:id').get(readBsc)
router.route('/create-solana-transaction').post(createSolanaTransaction)
router.route('/read-solana/:id').get(readSolana)
router.route('/deposit-solana').post(depositSolana)
router.route('/transfer-tokens-to-bsc-wallet').post(TransferTokensToBSCWallet)
router.route('/transfer-tokens-to-solana-wallet').post(TransferTokensToSolanaWallet)
router.route('/transfer-shill-tokens-from-bsc-wallet-to-address').post(TransferShillTokensFromBscWalletToAddress)
router.route('/transfer-shill-tokens-from-sol-wallet-to-address').post(TransferShillTokensFromSolanaWalletToAddress)
router.route('/create-custom-wallet-bsc-transaction').post(createCustomWalletBscTransaction)
router.route('/create-custom-wallet-solana-transaction').post(createCustomWalletSolanaTransaction)
router.route('/bsc-balance/:address').get(bscBalance)
router.route('/bsc-getAllNfts').get(getAllNfts)
router.route('/').post(create)
router.route('/').get(list)
router.route('/:id').get(get)
router.route("/transferNft").post(transferNft)
router.route("/transferToWallet").post(transferNftTOWallet)
router.route("/createNft").post(mintNft)

export default router;