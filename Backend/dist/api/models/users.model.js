"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const jwt_simple_1 = __importDefault(require("jwt-simple"));
const vars_1 = require("../../config/vars");
/**
 * User Schema
 * @private
 */
const UserSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
/**
 * Methods
 */
UserSchema.methods.verifyPassword = function (password) {
    return bcryptjs_1.default.compareSync(password, this.password);
};
UserSchema.methods.getPasswordHash = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const rounds = vars_1.pwdSaltRounds ? parseInt(vars_1.pwdSaltRounds) : 10;
        const hash = yield bcryptjs_1.default.hash(password, rounds);
        return hash;
    });
};
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
            exp: (0, moment_timezone_1.default)().add(vars_1.jwtExpirationInterval, 'minutes').unix(),
            iat: (0, moment_timezone_1.default)().unix(),
            sub: this._id,
        };
        return jwt_simple_1.default.encode(playload, vars_1.pwEncryptionKey);
    },
    passwordMatches(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcryptjs_1.default.compare(password, this.password);
        });
    },
});
UserSchema.pre('save', function save(next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!this.isModified('password'))
                return next();
            const rounds = vars_1.pwdSaltRounds ? parseInt(vars_1.pwdSaltRounds) : 10;
            const hash = yield bcryptjs_1.default.hash(this.password, rounds);
            this.password = hash;
            return next();
        }
        catch (error) {
            return next(error);
        }
    });
});
/**
 * @typedef User
 */
exports.default = mongoose_1.default.model('User', UserSchema);
