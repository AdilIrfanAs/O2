import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import moment from 'moment-timezone';
import jwt from 'jwt-simple';
import { pwdSaltRounds, jwtExpirationInterval, pwEncryptionKey } from '../../config/vars';

/**
 * User Interface
 */

export interface IUser extends Document {
  username: string;
  email: string;
  emailVerified: Boolean;
  profileImage: string,
  password: string,
  deleted: Boolean,
  resetCode: string
}
/**
 * User Schema
 * @private
 */
const UserSchema: Schema = new Schema({
  username: { type: String },
  email: { type: String },
  emailVerified: { type: Boolean },
  profileImage: { type: String },
  password: { type: String },
  deleted: { type: Boolean, default: false },
  resetCode: { type: String },
  discord: {
    token: {
      access_token: String,
      expires_in: String,
      refresh_token: String,
      scope: String,
      token_type: String,
    },
    user: {
      id: String,
      username: String
    },
  },
  keys: {
    private_key: String,
    public_key: String,
    mnemonic: String
  }
}, { timestamps: true }
);

/**
 * Methods
 */

UserSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.getPasswordHash = async function (password) {
  const rounds = pwdSaltRounds ? parseInt(pwdSaltRounds) : 10;
  const hash = await bcrypt.hash(password, rounds);
  return hash;
}

UserSchema.method({
  transform() {
    const transformed = {};
    const fields = ['_id', 'username', 'email', 'profileImage'];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });
    return transformed;
  },

  token() {
    const playload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    return jwt.encode(playload, pwEncryptionKey);
  },
  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
});

UserSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();
    const rounds = pwdSaltRounds ? parseInt(pwdSaltRounds) : 10;
    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;
    return next();
  }
  catch (error) {
    return next(error);
  }
});

/**
 * @typedef User
 */

export default mongoose.model<IUser>('User', UserSchema);