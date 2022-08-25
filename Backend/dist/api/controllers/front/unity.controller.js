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
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleMessage = void 0;
// API for simple message
const simpleMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.method == 'POST' && req.body.name !== undefined)
            return res.send(`Hello World Name ${req.body.name} received`);
        else
            return res.send('Hello World');
    }
    catch (error) {
        return next(error);
    }
});
exports.simpleMessage = simpleMessage;
