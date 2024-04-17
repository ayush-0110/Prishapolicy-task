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
exports.decodeAndVerifyJwtToken = exports.createToken = exports.verifyPassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcryptjs_1.default.hash(password, 10);
    });
}
exports.hashPassword = hashPassword;
function verifyPassword(password, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcryptjs_1.default.compare(password, hash);
    });
}
exports.verifyPassword = verifyPassword;
function createToken(userId, role, email) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jsonwebtoken_1.default.sign({ userId, role, email }, secret, { expiresIn: "1h" });
}
exports.createToken = createToken;
function decodeAndVerifyJwtToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in the environment");
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            return decoded;
        }
        catch (error) {
            console.error("JWT Error:", error);
            return undefined;
        }
    });
}
exports.decodeAndVerifyJwtToken = decodeAndVerifyJwtToken;
