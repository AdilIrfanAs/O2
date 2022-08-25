import Wallet from '../../models/wallets.model';
require("dotenv").config()
const solanaWeb3 = require("@solana/web3.js");
const bs58 = require("bs58");
const Web3 = require('web3');

export const signup = async (req, res, next) => {
    try {
        let payload = req.body
        let wallet: any = await Wallet.findOne({ 'titleId': payload.titleId, 'email': payload.email }).exec();

        if (!wallet) {
            var bscPublicKey: any, bscSecretKey: any;
            var fromWallet: any, solPublicKey: any, solSecretKey: any;

            const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

            const account = web3.eth.accounts.create();
            bscPublicKey = account.address;
            console.log('===BSC Public Key===', bscPublicKey);

            bscSecretKey = account.privateKey;
            console.log('===BSC Private Key===', bscSecretKey);

            console.log('===BSC Account===', account);

            fromWallet = solanaWeb3.Keypair.generate();
            solPublicKey = fromWallet.publicKey.toBase58()
            console.log('===Sol Public Key===', solPublicKey);

            solSecretKey = bs58.encode(fromWallet.secretKey);
            console.log('===Sol Private Key===', solSecretKey);

            wallet = await Wallet.create({
                titleId: payload.titleId,
                email: payload.email,
                username: payload.username,
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

    } catch (error) {
        return next(error)
    }
}

export const login = async (req, res, next) => {
    try {
        let payload = req.body
        let wallet: any = await Wallet.findOne({ 'titleId': payload.titleId, 'email': payload.email }).exec();

        if (wallet) {
            return res.send({ status: true, wallet });
        }
        else {
            return res.send({ status: false, message: 'No wallet found' });
        }

    } catch (error) {
        return next(error)
    }
}

export const saveFavouriteNft = async (req, res, next) => {
    try {
        let payload = req.body
        let wallet: any = await Wallet.findOne({ '_id': payload.id }).exec();

        if (wallet) {
            let favouriteNfts = [];
            let updateKey = '';

            switch (Number(payload.type)) {
                case 1:
                    favouriteNfts = wallet.bsc.favouriteNfts
                    updateKey = "bsc.favouriteNfts"
                    break;
                case 2:
                    favouriteNfts = wallet.sol.favouriteNfts
                    updateKey = "sol.favouriteNfts"
                    break;
            }

            if (favouriteNfts.includes(payload.address)) {
                let index = favouriteNfts.indexOf(payload.address);
                favouriteNfts.splice(index, 1)
            }
            else {
                favouriteNfts.push(payload.address)
            }
            await Wallet.findByIdAndUpdate({ _id: payload.id }, { $set: { [updateKey]: favouriteNfts } }, { new: true })
            return res.send({ status: true, favouriteNfts });
        }
        else {
            return res.send({ status: false, message: 'No wallet found' });
        }

    } catch (error) {
        return next(error)
    }
}

export const getFavouriteNfts = async (req, res, next) => {
    try {
        let payload = req.query
        let wallet: any = await Wallet.findOne({ '_id': payload.id }).exec();

        if (wallet) {
            let favouriteNfts = [];

            switch (Number(payload.type)) {
                case 1:
                    favouriteNfts = wallet.bsc.favouriteNfts
                    break;
                case 2:
                    favouriteNfts = wallet.sol.favouriteNfts
                    break;
            }
            return res.send({ status: true, favouriteNfts });
        }
        else {
            return res.send({ status: false, message: 'No wallet found' });
        }

    } catch (error) {
        return next(error)
    }
}