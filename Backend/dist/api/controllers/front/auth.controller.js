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
exports.discordCallback = exports.discordLogin = exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const users_model_1 = __importDefault(require("../../models/users.model"));
const vars_1 = require("../../../config/vars");
const randomstring_1 = __importDefault(require("randomstring"));
const emails_1 = require("../../utils/emails/emails");
const mongoose_1 = __importDefault(require("mongoose"));
const axios = require('axios');
var qs = require('qs');
require("dotenv").config();
const solanaWeb3 = require("@solana/web3.js");
const bip39 = require("bip39");
const bs58 = require("bs58");
const spl = require("@solana/spl-token");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { username, email, password } = req.body;
        if (username && email && password) {
            email = email.toLowerCase();
            let user = yield users_model_1.default.findOne({ email });
            if (user) {
                return res.status(200).send({ status: false, message: 'Email already exists' });
            }
            user = yield users_model_1.default.create({
                username, email, password
            });
            var accessToken = yield user.token();
            user = user.transform();
            let data = Object.assign(Object.assign({}, user), { accessToken });
            return res.status(200).send({
                status: true,
                message: 'User registered successfully',
                data: data
            });
        }
        else
            return res.status(200).send({ status: false, message: 'Required fields are missing' });
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
/**
 * Returns jwt token if valid address and password is provided
 * @public
 */
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password } = req.body;
        let user = yield users_model_1.default.findOne({ email }).exec();
        if (!user) {
            return res.status(200).send({ status: false, message: 'There is no account linked to that email address' });
        }
        if (!user.verifyPassword(password)) {
            return res.status(200).send({ status: false, message: 'Incorrect Password' });
        }
        var accessToken = yield user.token();
        user = user.transform();
        let data = Object.assign(Object.assign({}, user), { accessToken });
        delete data.password;
        return res.status(200).send({ status: true, message: 'User logged in successfully', data });
    }
    catch (error) {
        return next(error);
    }
});
exports.login = login;
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = req.body;
        let user = yield users_model_1.default.find({ email: payload.email });
        if (user.length) {
            let randString = randomstring_1.default.generate({
                length: 8,
                charset: 'alphanumeric'
            });
            yield users_model_1.default.findByIdAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(user[0]._id) }, { $set: { resetCode: randString } }, { new: true });
            let content = {
                "${url}": `${vars_1.siteUrl}/reset-password/${user[0]._id}/${randString}`
            };
            yield (0, emails_1.sendEmail)(payload.email, 'forgot-password', content);
            return res.send({ status: true, message: 'An email has been sent to your account. Please check your email and follow the instruction in it to reset your password.' });
        }
        else {
            return res.status(200).send({ status: false, message: 'There is no account linked to that email address' });
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = req.body;
        let user = yield users_model_1.default.find({ _id: new mongoose_1.default.Types.ObjectId(payload._id) });
        if (user.length) {
            if (user[0].resetCode === payload.code) {
                let newPayload = {
                    password: yield user[0].getPasswordHash(payload.password),
                    resetCode: ''
                };
                let updatedUser = yield users_model_1.default.findByIdAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(payload._id) }, { $set: newPayload }, { new: true });
                return res.send({ status: true, message: 'Password reset successfully', updatedUser });
            }
            else {
                return res.send({ status: false, message: 'Session expired, try again with other email link.' });
            }
        }
        else {
            return res.send({ status: false, message: 'Incorrent User Id' });
        }
    }
    catch (error) {
        return next(error);
    }
});
exports.resetPassword = resetPassword;
const discordLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).send({
        authorize_uri: `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${process.env.DISCORD_CALLBACK}&response_type=code&scope=identify%20applications.builds.read`
    });
});
exports.discordLogin = discordLogin;
const discordCallback = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.query.code)
            throw new Error("NoCodeProvided");
        const code = req.query.code;
        var data = qs.stringify({
            'client_id': process.env.DISCORD_CLIENT_ID,
            'client_secret': process.env.DISCORD_CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': process.env.DISCORD_CALLBACK
        });
        var config = {
            method: 'post',
            url: 'https://discord.com/api/oauth2/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            data: data
        };
        const tokenResponse = yield axios(config);
        console.log('===Token Response===', tokenResponse.data);
        config = {
            method: 'get',
            url: 'https://discord.com/api/oauth2/@me',
            headers: {
                'Authorization': `Bearer ${tokenResponse.data.access_token}`,
            }
        };
        const userResponse = yield axios(config);
        console.log('===User Response===', userResponse.data);
        const userData = userResponse.data.user;
        let user = yield users_model_1.default.findOne({ 'discord.user.id': userData.id }).exec();
        if (!user) {
            user = yield users_model_1.default.create({
                username: userData.username,
                discord: {
                    token: tokenResponse.data,
                    user: {
                        id: userData.id,
                        username: userData.username
                    }
                },
            });
            // generate keypair
            var fromWallet = solanaWeb3.Keypair.generate();
            const publicKey = fromWallet.publicKey.toBase58();
            console.log('===Public Key===', publicKey);
            const mnemonic = bip39.generateMnemonic();
            console.log('===Mnemonic===', mnemonic);
            const secretKey = bs58.encode(fromWallet.secretKey);
            console.log('===Private Key===', secretKey);
            const keys = {
                private_key: secretKey,
                public_key: publicKey,
                mnemonic: mnemonic
            };
            yield users_model_1.default.findByIdAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(user.id) }, { $set: { keys } });
        }
        res.send(user);
    }
    catch (error) {
        return next(error);
    }
});
exports.discordCallback = discordCallback;
