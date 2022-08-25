import User from '../../models/users.model';
import { siteUrl } from '../../../config/vars';
import randomstring from "randomstring";
import { sendEmail } from '../../utils/emails/emails';
import mongoose from 'mongoose';
const axios = require('axios');
var qs = require('qs');
require("dotenv").config()

const solanaWeb3 = require("@solana/web3.js");
const bip39 = require("bip39");
const bs58 = require("bs58");
const spl = require("@solana/spl-token");

export const register = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    if (username && email && password) {
      email = email.toLowerCase();

      let user: any = await User.findOne({ email });
      if (user) {
        return res.status(200).send({ status: false, message: 'Email already exists' });
      }

      user = await User.create({
        username, email, password
      });

      var accessToken = await user.token();
      user = user.transform();
      let data = {
        ...user,
        accessToken
      }

      return res.status(200).send({
        status: true,
        message: 'User registered successfully',
        data: data
      })
    }
    else return res.status(200).send({ status: false, message: 'Required fields are missing' });
  } catch (error) {
    next(error)
  }
}

/**
 * Returns jwt token if valid address and password is provided
 * @public
 */
export const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    let user: any = await User.findOne({ email }).exec();

    if (!user) {
      return res.status(200).send({ status: false, message: 'There is no account linked to that email address' });
    }

    if (!user.verifyPassword(password)) {
      return res.status(200).send({ status: false, message: 'Incorrect Password' });
    }

    var accessToken = await user.token();
    user = user.transform();
    let data = {
      ...user,
      accessToken
    }
    delete data.password;

    return res.status(200).send({ status: true, message: 'User logged in successfully', data });

  } catch (error) {
    return next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    let payload = req.body
    let user: any = await User.find({ email: payload.email })

    if (user.length) {
      let randString = randomstring.generate({
        length: 8,
        charset: 'alphanumeric'
      })
      await User.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(user[0]._id) }, { $set: { resetCode: randString } }, { new: true })

      let content = {
        "${url}": `${siteUrl}/reset-password/${user[0]._id}/${randString}`
      }

      await sendEmail(payload.email, 'forgot-password', content)
      return res.send({ status: true, message: 'An email has been sent to your account. Please check your email and follow the instruction in it to reset your password.' })
    }
    else {
      return res.status(200).send({ status: false, message: 'There is no account linked to that email address' });
    }

  } catch (error) {
    return next(error)
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    let payload = req.body
    let user: any = await User.find({ _id: new mongoose.Types.ObjectId(payload._id) })

    if (user.length) {
      if (user[0].resetCode === payload.code) {
        let newPayload = {
          password: await user[0].getPasswordHash(payload.password),
          resetCode: ''
        }
        let updatedUser = await User.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(payload._id) }, { $set: newPayload }, { new: true })
        return res.send({ status: true, message: 'Password reset successfully', updatedUser })
      }
      else {
        return res.send({ status: false, message: 'Session expired, try again with other email link.' })
      }
    }
    else {
      return res.send({ status: false, message: 'Incorrent User Id' })
    }
  } catch (error) {
    return next(error)
  }
}

export const discordLogin = async (req, res, next) => {
  return res.status(200).send({
    authorize_uri: `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${process.env.DISCORD_CALLBACK}&response_type=code&scope=identify%20applications.builds.read`
  });
}

export const discordCallback = async (req, res, next) => {
  try {
    if (!req.query.code) throw new Error("NoCodeProvided");
    const code = req.query.code;

    var data = qs.stringify({
      'client_id': process.env.DISCORD_CLIENT_ID,
      'client_secret': process.env.DISCORD_CLIENT_SECRET,
      'grant_type': 'authorization_code',
      'code': code,
      'redirect_uri': process.env.DISCORD_CALLBACK
    });

    var config: any = {
      method: 'post',
      url: 'https://discord.com/api/oauth2/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: data
    };

    const tokenResponse = await axios(config)
    console.log('===Token Response===', tokenResponse.data);

    config = {
      method: 'get',
      url: 'https://discord.com/api/oauth2/@me',
      headers: {
        'Authorization': `Bearer ${tokenResponse.data.access_token}`,
      }
    };

    const userResponse = await axios(config)
    console.log('===User Response===', userResponse.data);
    const userData = userResponse.data.user;

    let user: any = await User.findOne({ 'discord.user.id': userData.id }).exec();

    if (!user) {
      user = await User.create({
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
      const publicKey = fromWallet.publicKey.toBase58()
      console.log('===Public Key===', publicKey);

      const mnemonic = bip39.generateMnemonic();
      console.log('===Mnemonic===', mnemonic);

      const secretKey = bs58.encode(fromWallet.secretKey);
      console.log('===Private Key===', secretKey);

      const keys = {
        private_key: secretKey,
        public_key: publicKey,
        mnemonic: mnemonic
      }

      await User.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(user.id) }, { $set: { keys } })
    }

    res.send(user);

  } catch (error) {
    return next(error)
  }
}