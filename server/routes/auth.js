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
exports.authRouter = void 0;
const trpc_1 = require("./trpc");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const server_1 = require("@trpc/server");
const auth_1 = require("../middleware/auth");
const prisma = new client_1.PrismaClient();
const createUserInput = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.nativeEnum(client_1.Role),
});
exports.authRouter = (0, trpc_1.router)({
    register: trpc_1.publicProcedure.input(createUserInput).mutation(({ input, ctx }) => __awaiter(void 0, void 0, void 0, function* () {
        const hashedPassword = yield (0, auth_1.hashPassword)(input.password);
        const user = yield prisma.user.create({
            data: {
                email: input.email,
                password: hashedPassword,
                role: input.role
            }
        });
        return { status: 'success', message: 'Registration successful!', userId: user.id };
    })),
    login: trpc_1.publicProcedure.input(createUserInput).mutation(({ input, ctx }) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield prisma.user.findUnique({ where: { email: input.email } });
        if (!user || !(yield (0, auth_1.verifyPassword)(input.password, user.password)) || user.role !== input.role) {
            throw new server_1.TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
        }
        const token = (0, auth_1.createToken)(user.id, user.role, user.email);
        return { status: 'success', message: 'Logged in successfully!', token };
    })),
});
