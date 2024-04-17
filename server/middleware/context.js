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
exports.createContext = void 0;
const auth_1 = require("./auth");
function createContext({ req }) {
    return __awaiter(this, void 0, void 0, function* () {
        function getUserFromHeader() {
            return __awaiter(this, void 0, void 0, function* () {
                const authHeader = req.headers.authorization;
                if (authHeader) {
                    const token = authHeader.split(' ')[1];
                    return yield (0, auth_1.decodeAndVerifyJwtToken)(token);
                }
                return undefined;
            });
        }
        const user = yield getUserFromHeader();
        if (!user)
            return {};
        return { user };
    });
}
exports.createContext = createContext;
