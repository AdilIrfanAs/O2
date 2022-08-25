import Transaction from '../../models/transactions.model';
import Exchange from '../../models/exchange.model';
import mongoose from 'mongoose';
import Activity from "../../models/activity.model"
import Web3 from 'web3';
import { AbiItem } from 'web3-utils'
var solanaWeb3 = require('@solana/web3.js');
import bs58 from 'bs58';
const spl = require("@solana/spl-token");
require("dotenv").config()
import shillContractAbi from "../../utils/contracts/shillTokenAbi";
import contractAbi from "../../utils/contracts/osTokenAbi"
import Wallet from '../../models/wallets.model';
import { SendTransactionError } from '@solana/web3.js';
import { findMetadataPda } from '@metaplex-foundation/js';
// import { programs } from '@metaplex/js';
const Moralis = require('moralis');
import { createCreateMetadataAccountV2Instruction } from '@metaplex-foundation/mpl-token-metadata';
export class Collection {
    key;
    verified;
    constructor(args) {
        this.key = args.key;
        this.verified = args.verified;
    }
}


export class DataV2 {
    symbol;
    name;
    uri;
    sellerFeeBasisPoints;
    creators;
    collection;
    uses;
    constructor(args) {
        this.symbol = args.symbol;
        this.name = args.name;
        this.uri = args.uri;
        this.sellerFeeBasisPoints = args.sellerFeeBasisPoints;
        this.creators = args.creators;
        this.collection = args.collection;
        this.uses = args.uses;
    }
}

export class Creator {
    address;
    verified;
    share;
    constructor(args) {
        this.address = args.address;
        this.verified = args.verified;
        this.share = args.share;
    }
}
// API to create transaction
export const create = async (req, res, next) => {
    try {
        let payload = req.body

        let transaction: any = await Transaction.findOne({ txHash: payload.txHash });
        if (transaction) {
            return res.status(200).send({ status: false, message: 'Transaction hash already exists' });
        }
        if (payload.network == 1) {
            const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BSC_NETWORK_URL));
            const result = await web3.eth.getTransaction(payload.txHash)
            if (result == null || result.from != payload.address) {
                return res.status(200).send({ status: false, message: 'Invalid Transaction Hash' });
            }
        }
        else if (payload.network == 2) {
            // Connect to cluster
            const connection = new solanaWeb3.Connection(
                solanaWeb3.clusterApiUrl(process.env.SOL_NETWORK_URL),
                'confirmed',
            );

            const result = await connection.getTransaction(payload.txHash);
            if (result == null || result.meta.postTokenBalances[0].owner != payload.address) {
                return res.status(200).send({ status: false, message: 'Invalid Transaction Hash' });
            }
        }
        transaction = await Transaction.create(payload);
        return res.send({ status: true, data: transaction });
    } catch (error) {
        return next(error);
    }
};

// API to list transactions
export const list = async (req, res, next) => {
    try {
        let { page, limit, userId, startDate, endDate } = req.query
        let filter: any = {}

        if (userId !== undefined)
            filter.userId = new mongoose.Types.ObjectId(userId)

        if (startDate !== undefined && endDate !== undefined) {
            filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
        }

        page = page !== undefined && page !== '' ? parseInt(page) : 1
        limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10

        const total = await Transaction.countDocuments(filter)

        const transactions = await Transaction.aggregate([
            {
                $match: filter
            },
            { $sort: { _id: -1 } },
            { $skip: limit * (page - 1) },
            { $limit: limit },
        ])

        return res.send({
            status: true, message: 'Transactions fetched successfully',
            data: {
                transactions,
                pagination: {
                    page, limit, total,
                    pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit)
                }
            }
        })
    } catch (error) {
        return next(error)
    }
}

// API to get transaction
export const get = async (req, res, next) => {
    try {
        const transaction = await Transaction.findOne({ _id: req.params.id })
        if (transaction)
            return res.json({ status: true, message: 'Transaction retrieved successfully', transaction })
        else
            return res.json({ status: false, message: 'No record found' })
    } catch (error) {
        return next(error)
    }
}

// API to create binance transaction
export const createBscTransaction = async (req, res, next) => {
    try {
        let payload = req.body
        const PUBLIC_KEY = process.env.BSC_O2_PUBLIC_KEY
        const PRIVATE_KEY = process.env.BSC_O2_PRIVATE_KEY
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BSC_NETWORK_URL));
        const contractAddress = process.env.BSC_O2_CONTRACT_ADDRESS
        const contract = new web3.eth.Contract(contractAbi as AbiItem[], contractAddress)

        const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce
        //Transaction
        const tx = {
            from: PUBLIC_KEY,
            to: contractAddress,
            nonce: nonce,
            gas: 500000,
            data: contract.methods.transfer(payload.to, web3.utils.toWei(payload.amount.toString(), 'ether')).encodeABI(),
        }

        const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
        signPromise
            .then((signedTx) => {
                web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                    .on("transactionHash", function (hash) {
                        console.log(["Trx Hash:" + hash]);
                    })
                    .on("receipt", async function (receipt) {
                        console.log(["Receipt:", receipt]);

                        const transactionPayload = new Transaction({
                            amount: payload.amount,
                            address: payload.to,
                            txHash: receipt.transactionHash,
                            network: 1,
                            type: 2,
                        })

                        try {
                            await transactionPayload.save()
                            await Exchange.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(payload.exchangeId) }, { $set: { status: true } })

                            return res.json({ status: true, message: 'Transaction created successfully', receipt })
                        } catch (error) {
                            console.log(error)
                            return res.json({ status: false, message: 'Something went wrong creating transaction' })
                        }
                    })
                    .on("error", function (error) {
                        console.error;
                        return res.json({ status: false, message: error })
                    });
            })
            .catch((err) => {
                console.log("Promise failed:", err)
            })
    } catch (error) {
        return next(error)
    }
}

// API to get binance transaction detail
export const readBsc = async (req, res, next) => {
    try {
        let txHash = req.params.id;
        if (/^0x([A-Fa-f0-9]{64})$/.test(txHash)) {
            const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BSC_NETWORK_URL));

            var receipt = await web3.eth.getTransactionReceipt(txHash)
            if (receipt) {
                return res.json({ status: true, message: 'Transaction retrieved successfully', receipt })
            }
            else {
                return res.json({ status: false, message: 'No transaction found' })
            }
        }
        else {
            return res.json({ status: false, message: 'Invalid transaction hash' })
        }
    } catch (error) {
        return next(error)
    }
}

// API to create solana transaction
export const createSolanaTransaction = async (req, res, next) => {
    try {
        let payload = req.body

        // Connect to cluster
        const connection = new solanaWeb3.Connection(
            solanaWeb3.clusterApiUrl(process.env.SOL_NETWORK_URL),
            'confirmed',
        );

        // generate keypair
        const fromWallet = solanaWeb3.Keypair.fromSecretKey(
            bs58.decode(
                process.env.SOL_O2_PRIVATE_KEY
            )
        );
        var toWallet = new solanaWeb3.PublicKey(payload.to);

        // check balance
        console.log("From Wallet Balance:", await connection.getBalance(fromWallet.publicKey));
        console.log("To Wallet Balance:", await connection.getBalance(toWallet));

        const token = new solanaWeb3.PublicKey(process.env.SOL_O2_CONTRACT_ADDRESS);

        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromTokenAccount = await spl.getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            token,
            fromWallet.publicKey
        );

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toTokenAccount = await spl.getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            token,
            toWallet
        );

        // Transfer the new token to the "toTokenAccount" we just created
        let signature = await spl.transfer(
            connection,
            fromWallet,
            fromTokenAccount.address,
            toTokenAccount.address,
            fromWallet.publicKey,
            payload.amount * solanaWeb3.LAMPORTS_PER_SOL
        );

        if (signature) {
            console.log('SIGNATURE', signature);
            console.log("From Wallet Balance:", await connection.getBalance(fromWallet.publicKey));
            console.log("To Wallet Balance:", await connection.getBalance(toWallet));

            const transactionPayload = new Transaction({
                amount: payload.amount,
                address: payload.to,
                txHash: signature,
                network: 2,
                type: 2,
            })

            try {
                await transactionPayload.save()
                await Exchange.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(payload.exchangeId) }, { $set: { status: true } })

                return res.json({ status: true, message: 'Transaction created successfully', signature })
            } catch (error) {
                console.log(error)
                return res.json({ status: false, message: 'Something went wrong creating transaction' })
            }
        }
        else {
            return res.json({ status: false, message: 'Something went wrong creating transaction', signature })
        }

    } catch (error) {
        return next(error)
    }
}

// API to get solana transaction detail
export const readSolana = async (req, res, next) => {
    try {
        let txHash = req.params.id;
        // Connect to cluster
        const connection = new solanaWeb3.Connection(
            solanaWeb3.clusterApiUrl(process.env.SOL_NETWORK_URL),
            'confirmed',
        );

        const receipt = await connection.getTransaction(txHash);
        if (receipt) {
            return res.json({ status: true, message: 'Transaction retrieved successfully', receipt })
        }
        else {
            return res.json({ status: false, message: 'No transaction found' })
        }
    } catch (error) {
        return next(error)
    }
}

// API to deposit solana tokens
export const depositSolana = async (req, res, next) => {
    try {
        // Connect to cluster
        const connection = new solanaWeb3.Connection(
            solanaWeb3.clusterApiUrl('devnet'),
            'confirmed',
        );

        var wallet = new solanaWeb3.PublicKey(req.body.wallet);

        // check balance
        console.log("Wallet Balance:", await connection.getBalance(wallet));

        // add some initial balance. Not possible in production.
        var airdropSignature = await connection.requestAirdrop(
            wallet,
            solanaWeb3.LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(airdropSignature);
        console.log("Wallet Balance:", await connection.getBalance(wallet));

        return res.json({ status: true, message: 'Solana devnet tokens deposited successfully' })

    } catch (error) {
        return next(error)
    }
}

// API to transfer tokens to BSC wallet
export const TransferTokensToBSCWallet = async (req, res, next) => {
    try {
        let payload = req.body
        const PUBLIC_KEY = process.env.BSC_O2_PUBLIC_KEY
        const PRIVATE_KEY = process.env.BSC_O2_PRIVATE_KEY
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BSC_NETWORK_URL));
        const contractAddress = process.env.BSC_O2_CONTRACT_ADDRESS
        const contract = new web3.eth.Contract(contractAbi as AbiItem[], contractAddress)

        const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce
        //Transaction
        const tx = {
            from: PUBLIC_KEY,
            to: contractAddress,
            nonce: nonce,
            gas: 500000,
            data: contract.methods.transfer(payload.to, web3.utils.toWei(payload.amount.toString(), 'ether')).encodeABI(),
        }

        const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
        signPromise
            .then((signedTx) => {
                web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                    .on("transactionHash", function (hash) {
                        console.log(["Trx Hash:" + hash]);
                    })
                    .on("receipt", async function (receipt) {
                        console.log(["Receipt:", receipt]);

                        const transactionPayload = new Transaction({
                            amount: payload.amount,
                            address: payload.to,
                            txHash: receipt.transactionHash,
                            network: 1,
                            type: 2,
                            walletId: payload.walletId
                        })

                        try {
                            await transactionPayload.save()

                            const activityPayload = new Activity({
                                title: "Withdraw Token",
                                item: payload.amount + ' O2',
                                from: "Outland Odyssey Account",
                                to: payload.to,
                            })

                            await activityPayload.save()

                            return res.json({ status: true, message: 'Transaction created successfully', receipt })
                        } catch (error) {
                            console.log(error)
                            return res.json({ status: false, message: 'Something went wrong creating transaction' })
                        }
                    })
                    .on("error", function (error) {
                        console.error;
                        return res.json({ status: false, message: error })
                    });
            })
            .catch((err) => {
                console.log("Promise failed:", err)
            })
    } catch (error) {
        return next(error)
    }
}

// API to transfer tokens to Solana wallet
export const TransferTokensToSolanaWallet = async (req, res, next) => {
    try {
        let payload = req.body

        // Connect to cluster
        const connection = new solanaWeb3.Connection(
            solanaWeb3.clusterApiUrl(process.env.SOL_NETWORK_URL),
            'confirmed',
        );

        // generate keypair
        const fromWallet = solanaWeb3.Keypair.fromSecretKey(
            bs58.decode(
                process.env.SOL_O2_PRIVATE_KEY
            )
        );
        var toWallet = new solanaWeb3.PublicKey(payload.to);

        // check balance
        console.log("From Wallet Balance:", await connection.getBalance(fromWallet.publicKey));
        console.log("To Wallet Balance:", await connection.getBalance(toWallet));

        const token = new solanaWeb3.PublicKey(process.env.SOL_O2_CONTRACT_ADDRESS);

        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromTokenAccount = await spl.getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            token,
            fromWallet.publicKey
        );

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toTokenAccount = await spl.getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            token,
            toWallet
        );

        // Transfer the new token to the "toTokenAccount" we just created
        let signature = await spl.transfer(
            connection,
            fromWallet,
            fromTokenAccount.address,
            toTokenAccount.address,
            fromWallet.publicKey,
            payload.amount * solanaWeb3.LAMPORTS_PER_SOL
        );

        if (signature) {
            console.log('SIGNATURE', signature);
            console.log("From Wallet Balance:", await connection.getBalance(fromWallet.publicKey));
            console.log("To Wallet Balance:", await connection.getBalance(toWallet));

            const transactionPayload = new Transaction({
                amount: payload.amount,
                address: payload.to,
                txHash: signature,
                network: 2,
                type: 2,
                walletId: payload.walletId
            })

            try {
                await transactionPayload.save()

                const activityPayload = new Activity({
                    title: "Withdraw Token",
                    item: payload.amount + ' O2',
                    from: "Outland Odyssey Account",
                    to: payload.to,
                })

                await activityPayload.save()

                return res.json({ status: true, message: 'Transaction created successfully', signature })
            } catch (error) {
                console.log(error)
                return res.json({ status: false, message: 'Something went wrong creating transaction' })
            }
        }
        else {
            return res.json({ status: false, message: 'Something went wrong creating transaction', signature })
        }

    } catch (error) {
        return next(error)
    }
}

// API to create custom wallet binance transaction
export const createCustomWalletBscTransaction = async (req, res, next) => {
    try {
        let payload = req.body
        let wallet: any = await Wallet.findOne({ '_id': payload.walletId }).exec();

        const PUBLIC_KEY = wallet.bsc.public_key
        const PRIVATE_KEY = wallet.bsc.private_key
        console.log(PUBLIC_KEY)
        console.log(PRIVATE_KEY)
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BSC_NETWORK_URL));
        const contractAddress = process.env.BSC_O2_CONTRACT_ADDRESS
        const contract = new web3.eth.Contract(contractAbi as AbiItem[], contractAddress)

        const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce
        //Transaction
        const tx = {
            from: PUBLIC_KEY,
            to: contractAddress,
            nonce: nonce,
            gas: 500000,
            data: contract.methods.transfer(contractAddress, web3.utils.toWei(payload.amount.toString(), 'ether')).encodeABI(),
        }

        const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
        signPromise
            .then((signedTx) => {
                web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                    .on("transactionHash", function (hash) {
                        console.log(["Trx Hash:" + hash]);
                    })
                    .on("receipt", async function (receipt) {
                        console.log(["Receipt:", receipt]);

                        const transactionPayload = new Transaction({
                            amount: payload.amount,
                            address: contractAddress,
                            txHash: receipt.transactionHash,
                            network: 1,
                            type: 1,
                            walletId: payload.walletId
                        })

                        try {
                            await transactionPayload.save()

                            const activityPayload = new Activity({
                                title: "Deposit Token",
                                item: payload.amount + ' O2',
                                from: wallet.bsc.public_key,
                                to: "Outland Odyssey Account",
                            })

                            await activityPayload.save()
                            return res.json({ status: true, message: 'Transaction created successfully', receipt })
                        } catch (error) {
                            console.log(error)
                            return res.json({ status: false, message: 'Something went wrong creating transaction' })
                        }
                    })
                    .on("error", function (error) {
                        console.error;
                        return res.json({ status: false, message: error })
                    });
            })
            .catch((err) => {
                console.log("Promise failed:", err)
            })
    } catch (error) {
        return next(error)
    }
}

// API to create custom wallet solana transaction
export const createCustomWalletSolanaTransaction = async (req, res, next) => {
    try {
        let payload = req.body
        let wallet: any = await Wallet.findOne({ '_id': payload.walletId }).exec();

        const PUBLIC_KEY = wallet.sol.public_key
        const PRIVATE_KEY = wallet.sol.private_key

        // Connect to cluster
        const connection = new solanaWeb3.Connection(
            solanaWeb3.clusterApiUrl(process.env.SOL_NETWORK_URL),
            'confirmed',
        );

        // generate keypair
        const fromWallet = solanaWeb3.Keypair.fromSecretKey(
            bs58.decode(
                PRIVATE_KEY
            )
        );
        var toWallet = new solanaWeb3.PublicKey(process.env.SOL_DEPLOYER_ADDRESS);
        // check balance
        console.log("From Wallet Balance:", await connection.getBalance(fromWallet.publicKey));
        console.log("To Wallet Balance:", await connection.getBalance(toWallet));

        const token = new solanaWeb3.PublicKey(process.env.SOL_O2_CONTRACT_ADDRESS);

        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromTokenAccount = await spl.getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            token,
            fromWallet.publicKey
        );

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toTokenAccount = await spl.getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            token,
            toWallet
        );

        // Transfer the new token to the "toTokenAccount" we just created
        let signature = await spl.transfer(
            connection,
            fromWallet,
            fromTokenAccount.address,
            toTokenAccount.address,
            fromWallet.publicKey,
            payload.amount * solanaWeb3.LAMPORTS_PER_SOL
        );

        if (signature) {
            console.log('SIGNATURE', signature);
            console.log("From Wallet Balance:", await connection.getBalance(fromWallet.publicKey));
            console.log("To Wallet Balance:", await connection.getBalance(toWallet));

            const transactionPayload = new Transaction({
                amount: payload.amount,
                address: process.env.SOL_O2_CONTRACT_ADDRESS,
                txHash: signature,
                network: 2,
                type: 1,
                walletId: payload.walletId
            })

            try {
                await transactionPayload.save()

                const activityPayload = new Activity({
                    title: "Deposit Token",
                    item: payload.amount + ' O2',
                    from: wallet.sol.public_key,
                    to: "Outland Odyssey Account",
                })

                await activityPayload.save()

                return res.json({ status: true, message: 'Transaction created successfully', signature })
            } catch (error) {
                console.log(error)
                return res.json({ status: false, message: 'Something went wrong creating transaction' })
            }
        }
        else {
            return res.json({ status: false, message: 'Something went wrong creating transaction', signature })
        }

    } catch (error) {
        return next(error)
    }
}
export const bscBalance = async (req, res, next) => {
    try {
        const address = req.params.address;
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BSC_NETWORK_URL));

        const contractAddress = process.env.BSC_O2_CONTRACT_ADDRESS
        let contract: any = new web3.eth.Contract(contractAbi as AbiItem[], contractAddress);

        const tokenBalance = await contract.methods.balanceOf(address).call();
        const token = web3.utils.fromWei(tokenBalance.toString(), 'ether')

        const balance: any = await web3.eth.getBalance(address)
        const bscBalance = web3.utils.fromWei(balance.toString(), 'ether')

        const contractO2Token = await contract.methods.balanceOf(process.env.BSC_O2_CONTRACT_ADDRESS).call();
        const O2TokenBalance = web3.utils.fromWei(contractO2Token.toString(), 'ether')

        const shillContractAddress = process.env.BSC_CONTRACT_ADDRESS_SHILL_TOKEN
        let shillContract = new web3.eth.Contract(shillContractAbi as AbiItem[], shillContractAddress)
        const shillToken = await shillContract.methods.balanceOf(address).call();
        const shillTokenBalance = web3.utils.fromWei(shillToken.toString(), 'ether')

        if (tokenBalance) {
            try {
                return res.json({ status: true, message: 'Balance fetched successfully', data: { token, bscBalance, O2TokenBalance, shillTokenBalance } })
            } catch (error) {
                console.log(error)
                return res.json({ status: false, message: 'Something went wrong fetching balance' })

            }
        }
        else {
            return res.json({ status: false, message: 'Something went wrong fetching balance', data: { token, bscBalance, O2TokenBalance, shillTokenBalance } })
        }
    } catch (error) {
        return next(error)
    }
}

// API to transfer tokens from BSC wallet to address
export const TransferShillTokensFromBscWalletToAddress = async (req, res, next) => {
    try {
        let payload = req.body
        let wallet: any = await Wallet.findOne({ '_id': payload.walletId }).exec();

        const PUBLIC_KEY = wallet.bsc.public_key
        const PRIVATE_KEY = wallet.bsc.private_key

        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BSC_NETWORK_URL));
        const contractAddress = process.env.BSC_CONTRACT_ADDRESS_SHILL_TOKEN
        const contract = new web3.eth.Contract(shillContractAbi as AbiItem[], contractAddress)

        const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce
        //Transaction
        const tx = {
            from: PUBLIC_KEY,
            to: contractAddress,
            nonce: nonce,
            gas: 500000,
            data: contract.methods.transfer(process.env.BSC_O2_PUBLIC_KEY, web3.utils.toWei(payload.amount.toString(), 'ether')).encodeABI(),
        }

        const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
        signPromise
            .then((signedTx) => {
                web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                    .on("transactionHash", function (hash) {
                        console.log(["Trx Hash:" + hash]);
                    })
                    .on("receipt", async function (receipt) {
                        console.log(["Receipt:", receipt]);

                        const transactionPayload = new Transaction({
                            amount: payload.amount,
                            address: process.env.BSC_O2_PUBLIC_KEY,
                            txHash: receipt.transactionHash,
                            network: 1,
                            type: 2,
                            walletId: payload.walletId
                        })

                        try {
                            await transactionPayload.save()

                            const activityPayload = new Activity({
                                title: "Transfer Shill Token",
                                item: payload.amount + ' Shill',
                                from: PUBLIC_KEY,
                                to: process.env.BSC_O2_PUBLIC_KEY,
                            })

                            await activityPayload.save()
                            return res.json({ status: true, message: 'Transaction created successfully', receipt })
                        } catch (error) {
                            console.log(error)
                            return res.json({ status: false, message: 'Something went wrong creating transaction' })
                        }
                    })
                    .on("error", function (error) {
                        console.error;
                        return res.json({ status: false, message: error })
                    });
            })
            .catch((err) => {
                console.log("Promise failed:", err)
            })
    } catch (error) {
        return next(error)
    }
}

// API to transfer tokens from SOL wallet to address
export const TransferShillTokensFromSolanaWalletToAddress = async (req, res, next) => {
    try {
        let payload = req.body
        if (!payload.returnFee) {

            let wallet: any = await Wallet.findOne({ '_id': payload.walletId }).exec();

            const PUBLIC_KEY = wallet.sol.public_key
            const PRIVATE_KEY = wallet.sol.private_key

            // Connect to cluster
            const connection = new solanaWeb3.Connection(
                solanaWeb3.clusterApiUrl(process.env.SOL_NETWORK_URL),
                'confirmed',
            );

            // generate keypair
            const fromWallet = solanaWeb3.Keypair.fromSecretKey(
                bs58.decode(
                    PRIVATE_KEY
                )
            );
            var toWallet = new solanaWeb3.PublicKey(process.env.SOL_DEPLOYER_ADDRESS);

            // check balance
            console.log("From Wallet Balance:", await connection.getBalance(fromWallet.publicKey));
            console.log("To Wallet Balance:", await connection.getBalance(toWallet));

            const token = new solanaWeb3.PublicKey(process.env.SOL_SHILL_CONTRACT_ADDRESS);

            // Get the token account of the fromWallet address, and if it does not exist, create it
            const fromTokenAccount = await spl.getOrCreateAssociatedTokenAccount(
                connection,
                fromWallet,
                token,
                fromWallet.publicKey
            );

            // Get the token account of the toWallet address, and if it does not exist, create it
            const toTokenAccount = await spl.getOrCreateAssociatedTokenAccount(
                connection,
                fromWallet,
                token,
                toWallet
            );

            // Transfer the new token to the "toTokenAccount" we just created
            let signature = await spl.transfer(
                connection,
                fromWallet,
                fromTokenAccount.address,
                toTokenAccount.address,
                fromWallet.publicKey,
                payload.amount * solanaWeb3.LAMPORTS_PER_SOL
            );

            if (signature) {
                console.log('SIGNATURE', signature);
                console.log("From Wallet Balance:", await connection.getBalance(fromWallet.publicKey));
                console.log("To Wallet Balance:", await connection.getBalance(toWallet));

                const transactionPayload = new Transaction({
                    amount: payload.amount,
                    address: payload.to,
                    txHash: signature,
                    network: 2,
                    type: 2,
                    walletId: payload.walletId
                })

                try {
                    await transactionPayload.save()

                    const activityPayload = new Activity({
                        title: "Transfer Shill Token",
                        item: payload.amount + ' Shill',
                        from: PUBLIC_KEY,
                        to: process.env.SOL_DEPLOYER_ADDRESS,
                    })

                    await activityPayload.save()

                    return res.json({ status: true, message: 'Transaction created successfully', signature })
                } catch (error) {
                    console.log(error)
                    return res.json({ status: false, message: 'Something went wrong creating transaction' })
                }
            }

            else {
                return res.json({ status: false, message: 'Something went wrong creating transaction', signature })
            }

        }
        else {
            let wallet: any = await Wallet.findOne({ '_id': payload.walletId }).exec();

            const PUBLIC_KEY = wallet.sol.public_key
            const PRIVATE_KEY = process.env.SOL_TRANSFER_PRIVATE_KEY

            // Connect to cluster
            const connection = new solanaWeb3.Connection(
                solanaWeb3.clusterApiUrl(process.env.SOL_NETWORK_URL),
                'confirmed',
            );

            // generate keypair
            const fromWallet = solanaWeb3.Keypair.fromSecretKey(
                bs58.decode(
                    PRIVATE_KEY
                )
            );
            var toWallet = new solanaWeb3.PublicKey(PUBLIC_KEY);

            // check balance
            console.log("From Wallet Balance:", await connection.getBalance(fromWallet.publicKey));
            console.log("To Wallet Balance:", await connection.getBalance(toWallet));

            const token = new solanaWeb3.PublicKey(process.env.SOL_SHILL_CONTRACT_ADDRESS);

            // Get the token account of the fromWallet address, and if it does not exist, create it
            const fromTokenAccount = await spl.getOrCreateAssociatedTokenAccount(
                connection,
                fromWallet,
                token,
                fromWallet.publicKey
            );

            // Get the token account of the toWallet address, and if it does not exist, create it
            const toTokenAccount = await spl.getOrCreateAssociatedTokenAccount(
                connection,
                fromWallet,
                token,
                toWallet
            );

            // Transfer the new token to the "toTokenAccount" we just created
            let signature = await spl.transfer(
                connection,
                fromWallet,
                fromTokenAccount.address,
                toTokenAccount.address,
                fromWallet.publicKey,
                payload.amount * solanaWeb3.LAMPORTS_PER_SOL
            );

            if (signature) {
                console.log('SIGNATURE', signature);
                console.log("From Wallet Balance:", await connection.getBalance(fromWallet.publicKey));
                console.log("To Wallet Balance:", await connection.getBalance(toWallet));

                const transactionPayload = new Transaction({
                    amount: payload.amount,
                    address: payload.to,
                    txHash: signature,
                    network: 2,
                    type: 2,
                    walletId: payload.walletId
                })

                try {
                    await transactionPayload.save()

                    // const activityPayload = new Activity({
                    //     title: "Transfer Shill Token",
                    //     item: payload.amount + ' Shill',
                    //     from: process.env.SOL_DEPLOYER_ADDRESS,
                    //     to: PUBLIC_KEY,
                    // })

                    // await activityPayload.save()

                    return res.json({ status: true, message: 'Transaction created successfully', signature })
                } catch (error) {
                    console.log(error)
                    return res.json({ status: false, message: 'Something went wrong creating transaction' })
                }
            }

            else {
                return res.json({ status: false, message: 'Something went wrong creating transaction', signature })
            }


        }
    }
    catch (error) {
        return next(error)
    }
}

export const getAllNfts = async (req, res, next) => {
    Moralis.start({ serverUrl: "https://jz1deuzsyitm.usemoralis.com:2053/server", appId: "yPAhRpSh5PO4qtSiTB9MEzjvzxAMIluhAOlYAFbP" });

    const options = {
        chain: "bsc",
        address: "0x2132FD9E6996f2F484700b5A34770D8D67e4a496",
    };
    const bscNFTs = await Moralis.Web3API.account.getNFTs(options);
    return res.json({ status: true, message: 'Nft fetch successfully', bscNFTs })
}

export const transferNft = async (req, res, next) => {

    const payload = req.body

    let wallet: any = await Wallet.findOne({ '_id': payload.walletId }).exec();

    const PUBLIC_KEY = wallet.sol.public_key
    const PRIVATE_KEY = wallet.sol.private_key
    const toWalletAddress = "DtgD1No5bGH63JsFei96xKYbE8cKBfju3qRQNFoF7wjs"

    var connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("devnet"), "confirmed");
    try {
        const payer = solanaWeb3.Keypair.fromSecretKey(
            bs58.decode(
                PRIVATE_KEY
            )
        );
        const token = new solanaWeb3.PublicKey(payload.mintAddress);
        const toWallet = new solanaWeb3.PublicKey(
            toWalletAddress
        );
        const fromTokenAccount = await spl.getOrCreateAssociatedTokenAccount(
            connection,
            payer,
            token,
            payer.publicKey,
            false,
            null,
            spl.TOKEN_PROGRAM_ID,
        );

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toTokenAccount = await spl.getOrCreateAssociatedTokenAccount(
            connection,
            payer,
            token,
            toWallet,
            false,
            null,
            spl.TOKEN_PROGRAM_ID,
        );
        let signature = await spl.transfer(
            connection,
            payer,
            fromTokenAccount.address,
            toTokenAccount.address,
            payer,
            1,
            [],
            false,
            spl.TOKEN_PROGRAM_ID
        );

        const activityPayload = new Activity({
            title: "Transfer NFT",
            imageUrl: payload.imageUrl,
            name: payload.name,
            serialNumber: payload.serialNumber,
            from: PUBLIC_KEY,
            to: toWalletAddress,
        })

        await activityPayload.save()
        return res.json({ signature: signature });
    } catch (error) {
        console.log(error)
        return res.json({ error: error });
    }
};

export const transferNftTOWallet = async (req, res, next) => {

    const payload = req.body

    let wallet: any = await Wallet.findOne({ '_id': payload.walletId }).exec();



    var connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("devnet"), "confirmed");
    try {
        const PUBLIC_KEY = wallet.sol.public_key
        const PRIVATE_KEY = process.env.SOL_TRANSFER_PRIVATE_KEY
        const toWalletAddress = PUBLIC_KEY
        const payer = solanaWeb3.Keypair.fromSecretKey(
            bs58.decode(
                PRIVATE_KEY
            )
        );
        const token = new solanaWeb3.PublicKey(payload.mintAddress);
        const toWallet = new solanaWeb3.PublicKey(
            toWalletAddress
        );
        const fromTokenAccount = await spl.getOrCreateAssociatedTokenAccount(
            connection,
            payer,
            token,
            payer.publicKey,
            false,
            null,
            spl.TOKEN_PROGRAM_ID,
        );

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toTokenAccount = await spl.getOrCreateAssociatedTokenAccount(
            connection,
            payer,
            token,
            toWallet,
            false,
            null,
            spl.TOKEN_PROGRAM_ID,
        );
        let signature = await spl.transfer(
            connection,
            payer,
            fromTokenAccount.address,
            toTokenAccount.address,
            payer,
            1,
            [],
            false,
            spl.TOKEN_PROGRAM_ID
        );

        const activityPayload = new Activity({
            title: "Transfer NFT",
            imageUrl: payload.imageUrl,
            name: payload.name,
            serialNumber: payload.serialNumber,
            from: PUBLIC_KEY,
            to: toWalletAddress,
        })

        await activityPayload.save()
        return res.json({ signature: signature });
    } catch (error) {
        console.log(error)
        return res.json({ error: error });
    }
};
