"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const wallets_model_1 = __importDefault(require("../../models/wallets.model"));
require("dotenv").config();
const solanaWeb3 = require("@solana/web3.js");
const bs58 = require("bs58");
const Web3 = require('web3');
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = req.body;
        let wallet = yield wallets_model_1.default.findOne({ 'titleId': payload.titleId, 'email': payload.email }).exec();
        if (!wallet) {
            var bscPublicKey, bscSecretKey;
            var fromWallet, solPublicKey, solSecretKey;
            const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
            const account = web3.eth.accounts.create();
            bscPublicKey = account.address;
            console.log('===BSC Public Key===', bscPublicKey);
            bscSecretKey = account.privateKey;
            console.log('===BSC Private Key===', bscSecretKey);
            console.log('===BSC Account===', account);
            fromWallet = solanaWeb3.Keypair.generate();
            solPublicKey = fromWallet.publicKey.toBase58();
            console.log('===Sol Public Key===', solPublicKey);
            solSecretKey = bs58.encode(fromWallet.secretKey);
            console.log('===Sol Private Key===', solSecretKey);
            wallet = yield wallets_model_1.default.create({
                titleId: payload.titleId,
                email: payload.email,
                bsc: {
                    private_key: bscSecretKey,
                    public_key: bscPublicKey
                },
                sol: {
                    private_key: solSecretKey,
                    public_key: solPublicKey
                }
            });
            return res.send({ status: true, wallet });
        }
        else {
            return res.send({ status: false, message: 'Wallet already exists' });
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = req.body;
        let wallet = yield wallets_model_1.default.findOne({ 'titleId': payload.titleId, 'email': payload.email }).exec();
        if (wallet) {
            return res.send({ status: true, wallet });
        }
        else {
            return res.send({ status: false, message: 'No wallet found' });
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.login = login;
