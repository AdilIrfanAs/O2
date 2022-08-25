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
exports.bscBalance = exports.createCustomWalletSolanaTransaction = exports.createCustomWalletBscTransaction = exports.TransferTokensToSolanaWallet = exports.TransferTokensToBSCWallet = exports.depositSolana = exports.readSolana = exports.createSolanaTransaction = exports.readBsc = exports.createBscTransaction = exports.get = exports.list = exports.create = void 0;
const transactions_model_1 = __importDefault(require("../../models/transactions.model"));
const exchange_model_1 = __importDefault(require("../../models/exchange.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const activity_model_1 = __importDefault(require("../../models/activity.model"));
const web3_1 = __importDefault(require("web3"));
var solanaWeb3 = require('@solana/web3.js');
const bs58_1 = __importDefault(require("bs58"));
const spl = require("@solana/spl-token");
require("dotenv").config();
const contractAbi = require("../../utils/contracts/osTokenAbi.json");
const wallets_model_1 = __importDefault(require("../../models/wallets.model"));
// API to create transaction
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = req.body;
        let transaction = yield transactions_model_1.default.findOne({ txHash: payload.txHash });
        if (transaction) {
            return res.status(200).send({ status: false, message: 'Transaction hash already exists' });
        }
        if (payload.network == 1) {
            const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(process.env.BSC_NETWORK_URL));
            const result = yield web3.eth.getTransaction(payload.txHash);
            if (result == null || result.from != payload.address) {
                return res.status(200).send({ status: false, message: 'Invalid Transaction Hash' });
            }
        }
        else if (payload.network == 2) {
            // Connect to cluster
            const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(process.env.SOL_NETWORK_URL), 'confirmed');
            const result = yield connection.getTransaction(payload.txHash);
            if (result == null || result.meta.postTokenBalances[0].owner != payload.address) {
                return res.status(200).send({ status: false, message: 'Invalid Transaction Hash' });
            }
        }
        transaction = yield transactions_model_1.default.create(payload);
        return res.send({ status: true, data: transaction });
    }
    catch (error) {
        return next(error);
    }
});
exports.create = create;
// API to list transactions
const list = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { page, limit, userId, startDate, endDate } = req.query;
        let filter = {};
        if (userId !== undefined)
            filter.userId = new mongoose_1.default.Types.ObjectId(userId);
        if (startDate !== undefined && endDate !== undefined) {
            filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        page = page !== undefined && page !== '' ? parseInt(page) : 1;
        limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10;
        const total = yield transactions_model_1.default.countDocuments(filter);
        const transactions = yield transactions_model_1.default.aggregate([
            {
                $match: filter
            },
            // {
            //     '$lookup': {
            //         'from': 'users',
            //         'localField': 'userId',
            //         'foreignField': '_id',
            //         'as': 'user'
            //     }
            // }, {
            //     '$unwind': {
            //         'path': '$user'
            //     }
            // },
            { $sort: { _id: -1 } },
            { $skip: limit * (page - 1) },
            { $limit: limit },
        ]);
        return res.send({
            status: true, message: 'Transactions fetched successfully',
            data: {
                transactions,
                pagination: {
                    page, limit, total,
                    pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit)
                }
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.list = list;
// API to get transaction
const get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield transactions_model_1.default.findOne({ _id: req.params.id });
        if (transaction)
            return res.json({ status: true, message: 'Transaction retrieved successfully', transaction });
        else
            return res.json({ status: false, message: 'No record found' });
    }
    catch (error) {
        return next(error);
    }
});
exports.get = get;
// API to create binance transaction
const createBscTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = req.body;
        const PUBLIC_KEY = process.env.BSC_PUBLIC_KEY;
        const PRIVATE_KEY = process.env.BSC_PRIVATE_KEY;
        const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(process.env.BSC_NETWORK_URL));
        const contractAddress = process.env.BSC_CONTRACT_ADDRESS;
        const contract = new web3.eth.Contract(contractAbi, contractAddress);
        const nonce = yield web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
        //Transaction
        const tx = {
            from: PUBLIC_KEY,
            to: contractAddress,
            nonce: nonce,
            gas: 500000,
            data: contract.methods.transfer(payload.to, web3.utils.toWei(payload.amount.toString(), 'ether')).encodeABI(),
        };
        const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
        signPromise
            .then((signedTx) => {
            web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                .on("transactionHash", function (hash) {
                console.log(["Trx Hash:" + hash]);
            })
                .on("receipt", function (receipt) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log(["Receipt:", receipt]);
                    const transactionPayload = new transactions_model_1.default({
                        amount: payload.amount,
                        address: payload.to,
                        txHash: receipt.transactionHash,
                        network: 1,
                        type: 2,
                    });
                    try {
                        yield transactionPayload.save();
                        yield exchange_model_1.default.findByIdAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(payload.exchangeId) }, { $set: { status: true } });
                        return res.json({ status: true, message: 'Transaction created successfully', receipt });
                    }
                    catch (error) {
                        console.log(error);
                        return res.json({ status: false, message: 'Something went wrong creating transaction' });
                    }
                });
            })
                .on("error", function (error) {
                console.error;
                return res.json({ status: false, message: error });
            });
        })
            .catch((err) => {
            console.log("Promise failed:", err);
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.createBscTransaction = createBscTransaction;
// API to get binance transaction detail
const readBsc = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let txHash = req.params.id;
        if (/^0x([A-Fa-f0-9]{64})$/.test(txHash)) {
            const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(process.env.BSC_NETWORK_URL));
            var receipt = yield web3.eth.getTransactionReceipt(txHash);
            if (receipt) {
                return res.json({ status: true, message: 'Transaction retrieved successfully', receipt });
            }
            else {
                return res.json({ status: false, message: 'No transaction found' });
            }
        }
        else {
            return res.json({ status: false, message: 'Invalid transaction hash' });
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.readBsc = readBsc;
// API to create solana transaction
const createSolanaTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = req.body;
        // Connect to cluster
        const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(process.env.SOL_NETWORK_URL), 'confirmed');
        // generate keypair
        const fromWallet = solanaWeb3.Keypair.fromSecretKey(bs58_1.default.decode(process.env.SOL_PRIVATE_KEY));
        var toWallet = new solanaWeb3.PublicKey(payload.to);
        // check balance
        console.log("From Wallet Balance:", yield connection.getBalance(fromWallet.publicKey));
        console.log("To Wallet Balance:", yield connection.getBalance(toWallet));
        const token = new solanaWeb3.PublicKey(process.env.SOL_CONTRACT_ADDRESS);
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromTokenAccount = yield spl.getOrCreateAssociatedTokenAccount(connection, fromWallet, token, fromWallet.publicKey);
        // Get the token account of the toWallet address, and if it does not exist, create it
        const toTokenAccount = yield spl.getOrCreateAssociatedTokenAccount(connection, fromWallet, token, toWallet);
        // Transfer the new token to the "toTokenAccount" we just created
        let signature = yield spl.transfer(connection, fromWallet, fromTokenAccount.address, toTokenAccount.address, fromWallet.publicKey, payload.amount * solanaWeb3.LAMPORTS_PER_SOL);
        if (signature) {
            console.log('SIGNATURE', signature);
            console.log("From Wallet Balance:", yield connection.getBalance(fromWallet.publicKey));
            console.log("To Wallet Balance:", yield connection.getBalance(toWallet));
            const transactionPayload = new transactions_model_1.default({
                amount: payload.amount,
                address: payload.to,
                txHash: signature,
                network: 2,
                type: 2,
            });
            try {
                yield transactionPayload.save();
                yield exchange_model_1.default.findByIdAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(payload.exchangeId) }, { $set: { status: true } });
                return res.json({ status: true, message: 'Transaction created successfully', signature });
            }
            catch (error) {
                console.log(error);
                return res.json({ status: false, message: 'Something went wrong creating transaction' });
            }
        }
        else {
            return res.json({ status: false, message: 'Something went wrong creating transaction', signature });
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.createSolanaTransaction = createSolanaTransaction;
// API to get solana transaction detail
const readSolana = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let txHash = req.params.id;
        // Connect to cluster
        const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(process.env.SOL_NETWORK_URL), 'confirmed');
        const receipt = yield connection.getTransaction(txHash);
        if (receipt) {
            return res.json({ status: true, message: 'Transaction retrieved successfully', receipt });
        }
        else {
            return res.json({ status: false, message: 'No transaction found' });
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.readSolana = readSolana;
// API to deposit solana tokens
const depositSolana = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to cluster
        const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');
        var wallet = new solanaWeb3.PublicKey(req.body.wallet);
        // check balance
        console.log("Wallet Balance:", yield connection.getBalance(wallet));
        // add some initial balance. Not possible in production.
        var airdropSignature = yield connection.requestAirdrop(wallet, solanaWeb3.LAMPORTS_PER_SOL);
        yield connection.confirmTransaction(airdropSignature);
        console.log("Wallet Balance:", yield connection.getBalance(wallet));
        return res.json({ status: true, message: 'Solana devnet tokens deposited successfully' });
    }
    catch (error) {
        return next(error);
    }
});
exports.depositSolana = depositSolana;
// API to transfer tokens to BSC wallet
const TransferTokensToBSCWallet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = req.body;
        const PUBLIC_KEY = process.env.BSC_PUBLIC_KEY;
        const PRIVATE_KEY = process.env.BSC_PRIVATE_KEY;
        const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(process.env.BSC_NETWORK_URL));
        const contractAddress = process.env.BSC_CONTRACT_ADDRESS;
        const contract = new web3.eth.Contract(contractAbi, contractAddress);
        const nonce = yield web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
        //Transaction
        const tx = {
            from: PUBLIC_KEY,
            to: contractAddress,
            nonce: nonce,
            gas: 500000,
            data: contract.methods.transfer(payload.to, web3.utils.toWei(payload.amount.toString(), 'ether')).encodeABI(),
        };
        const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
        signPromise
            .then((signedTx) => {
            web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                .on("transactionHash", function (hash) {
                console.log(["Trx Hash:" + hash]);
            })
                .on("receipt", function (receipt) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log(["Receipt:", receipt]);
                    const transactionPayload = new transactions_model_1.default({
                        amount: payload.amount,
                        address: payload.to,
                        txHash: receipt.transactionHash,
                        network: 1,
                        type: 2,
                        walletId: payload.walletId
                    });
                    try {
                        yield transactionPayload.save();
                        const activityPayload = new activity_model_1.default({
                            title: "Withdraw Token",
                            item: payload.amount,
                            from: "Outland Odyssey Account",
                            to: payload.to,
                        });
                        yield activityPayload.save();
                        return res.json({ status: true, message: 'Transaction created successfully', receipt });
                    }
                    catch (error) {
                        console.log(error);
                        return res.json({ status: false, message: 'Something went wrong creating transaction' });
                    }
                });
            })
                .on("error", function (error) {
                console.error;
                return res.json({ status: false, message: error });
            });
        })
            .catch((err) => {
            console.log("Promise failed:", err);
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.TransferTokensToBSCWallet = TransferTokensToBSCWallet;
// API to transfer tokens to Solana wallet
const TransferTokensToSolanaWallet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = req.body;
        // Connect to cluster
        const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(process.env.SOL_NETWORK_URL), 'confirmed');
        // generate keypair
        const fromWallet = solanaWeb3.Keypair.fromSecretKey(bs58_1.default.decode(process.env.SOL_PRIVATE_KEY));
        var toWallet = new solanaWeb3.PublicKey(payload.to);
        // check balance
        console.log("From Wallet Balance:", yield connection.getBalance(fromWallet.publicKey));
        console.log("To Wallet Balance:", yield connection.getBalance(toWallet));
        const token = new solanaWeb3.PublicKey(process.env.SOL_CONTRACT_ADDRESS);
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromTokenAccount = yield spl.getOrCreateAssociatedTokenAccount(connection, fromWallet, token, fromWallet.publicKey);
        // Get the token account of the toWallet address, and if it does not exist, create it
        const toTokenAccount = yield spl.getOrCreateAssociatedTokenAccount(connection, fromWallet, token, toWallet);
        // Transfer the new token to the "toTokenAccount" we just created
        let signature = yield spl.transfer(connection, fromWallet, fromTokenAccount.address, toTokenAccount.address, fromWallet.publicKey, payload.amount * solanaWeb3.LAMPORTS_PER_SOL);
        if (signature) {
            console.log('SIGNATURE', signature);
            console.log("From Wallet Balance:", yield connection.getBalance(fromWallet.publicKey));
            console.log("To Wallet Balance:", yield connection.getBalance(toWallet));
            const transactionPayload = new transactions_model_1.default({
                amount: payload.amount,
                address: payload.to,
                txHash: signature,
                network: 2,
                type: 2,
                walletId: payload.walletId
            });
            try {
                yield transactionPayload.save();
                const activityPayload = new activity_model_1.default({
                    title: "Withdraw Token",
                    item: payload.amount,
                    from: "Outland Odyssey Account",
                    to: payload.to,
                });
                yield activityPayload.save();
                return res.json({ status: true, message: 'Transaction created successfully', signature });
            }
            catch (error) {
                console.log(error);
                return res.json({ status: false, message: 'Something went wrong creating transaction' });
            }
        }
        else {
            return res.json({ status: false, message: 'Something went wrong creating transaction', signature });
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.TransferTokensToSolanaWallet = TransferTokensToSolanaWallet;
// API to create custom wallet binance transaction
const createCustomWalletBscTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = req.body;
        let wallet = yield wallets_model_1.default.findOne({ '_id': payload.walletId }).exec();
        const PUBLIC_KEY = wallet.bsc.public_key;
        const PRIVATE_KEY = wallet.bsc.private_key;
        console.log(PUBLIC_KEY);
        console.log(PRIVATE_KEY);
        const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(process.env.BSC_NETWORK_URL));
        const contractAddress = process.env.BSC_CONTRACT_ADDRESS;
        const contract = new web3.eth.Contract(contractAbi, contractAddress);
        const nonce = yield web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
        //Transaction
        const tx = {
            from: PUBLIC_KEY,
            to: contractAddress,
            nonce: nonce,
            gas: 500000,
            data: contract.methods.transfer(contractAddress, web3.utils.toWei(payload.amount.toString(), 'ether')).encodeABI(),
        };
        const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
        signPromise
            .then((signedTx) => {
            web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                .on("transactionHash", function (hash) {
                console.log(["Trx Hash:" + hash]);
            })
                .on("receipt", function (receipt) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log(["Receipt:", receipt]);
                    const transactionPayload = new transactions_model_1.default({
                        amount: payload.amount,
                        address: contractAddress,
                        txHash: receipt.transactionHash,
                        network: 1,
                        type: 1,
                        walletId: payload.walletId
                    });
                    try {
                        yield transactionPayload.save();
                        const activityPayload = new activity_model_1.default({
                            title: "Deposit Token",
                            item: payload.amount,
                            from: wallet.bsc.public_key,
                            to: "Outland Odyssey Account",
                        });
                        yield activityPayload.save();
                        return res.json({ status: true, message: 'Transaction created successfully', receipt });
                    }
                    catch (error) {
                        console.log(error);
                        return res.json({ status: false, message: 'Something went wrong creating transaction' });
                    }
                });
            })
                .on("error", function (error) {
                console.error;
                return res.json({ status: false, message: error });
            });
        })
            .catch((err) => {
            console.log("Promise failed:", err);
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.createCustomWalletBscTransaction = createCustomWalletBscTransaction;
// API to create custom wallet solana transaction
const createCustomWalletSolanaTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = req.body;
        let wallet = yield wallets_model_1.default.findOne({ '_id': payload.walletId }).exec();
        const PUBLIC_KEY = wallet.sol.public_key;
        const PRIVATE_KEY = wallet.sol.private_key;
        // Connect to cluster
        const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(process.env.SOL_NETWORK_URL), 'confirmed');
        // generate keypair
        const fromWallet = solanaWeb3.Keypair.fromSecretKey(bs58_1.default.decode(PRIVATE_KEY));
        var toWallet = new solanaWeb3.PublicKey(process.env.SOL_DEPLOYER_ADDRESS);
        // check balance
        console.log("From Wallet Balance:", yield connection.getBalance(fromWallet.publicKey));
        console.log("To Wallet Balance:", yield connection.getBalance(toWallet));
        const token = new solanaWeb3.PublicKey(process.env.SOL_CONTRACT_ADDRESS);
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromTokenAccount = yield spl.getOrCreateAssociatedTokenAccount(connection, fromWallet, token, fromWallet.publicKey);
        // Get the token account of the toWallet address, and if it does not exist, create it
        const toTokenAccount = yield spl.getOrCreateAssociatedTokenAccount(connection, fromWallet, token, toWallet);
        // Transfer the new token to the "toTokenAccount" we just created
        let signature = yield spl.transfer(connection, fromWallet, fromTokenAccount.address, toTokenAccount.address, fromWallet.publicKey, payload.amount * solanaWeb3.LAMPORTS_PER_SOL);
        if (signature) {
            console.log('SIGNATURE', signature);
            console.log("From Wallet Balance:", yield connection.getBalance(fromWallet.publicKey));
            console.log("To Wallet Balance:", yield connection.getBalance(toWallet));
            const transactionPayload = new transactions_model_1.default({
                amount: payload.amount,
                address: process.env.SOL_CONTRACT_ADDRESS,
                txHash: signature,
                network: 2,
                type: 1,
                walletId: payload.walletId
            });
            try {
                yield transactionPayload.save();
                const activityPayload = new activity_model_1.default({
                    title: "Deposit Token",
                    item: payload.amount,
                    from: wallet.sol.public_key,
                    to: "Outland Odyssey Account",
                });
                yield activityPayload.save();
                return res.json({ status: true, message: 'Transaction created successfully', signature });
            }
            catch (error) {
                console.log(error);
                return res.json({ status: false, message: 'Something went wrong creating transaction' });
            }
        }
        else {
            return res.json({ status: false, message: 'Something went wrong creating transaction', signature });
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.createCustomWalletSolanaTransaction = createCustomWalletSolanaTransaction;
const bscBalance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const address = req.params.address;
        const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(process.env.BSC_NETWORK_URL));
        const contractAddress = process.env.BSC_CONTRACT_ADDRESS;
        let contract = new web3.eth.Contract(contractAbi, contractAddress);
        const tokenBalance = yield contract.methods.balanceOf(address).call();
        const token = web3.utils.fromWei(tokenBalance.toString(), 'ether');
        const balance = yield web3.eth.getBalance(address);
        const bscBalance = web3.utils.fromWei(balance.toString(), 'ether');
        const contractO2Token = yield contract.methods.balanceOf(process.env.BSC_CONTRACT_ADDRESS).call();
        const O2TokenBalance = web3.utils.fromWei(contractO2Token.toString(), 'ether');
        if (tokenBalance) {
            try {
                return res.json({ status: true, message: 'Balance fetched successfully', data: { token, bscBalance, O2TokenBalance } });
            }
            catch (error) {
                console.log(error);
                return res.json({ status: false, message: 'Something went wrong creating transaction' });
            }
        }
        else {
            return res.json({ status: false, message: 'Something went wrong creating transaction', data: { token, bscBalance, O2TokenBalance } });
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.bscBalance = bscBalance;
