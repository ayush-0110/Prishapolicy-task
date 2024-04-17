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
exports.publicProcedure = exports.router = exports.protectedProcedure = exports.t = void 0;
const server_1 = require("@trpc/server");
const server_2 = require("@trpc/server");
exports.t = server_1.initTRPC.context().create();
exports.protectedProcedure = exports.t.procedure.use(function isAuthed(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const { ctx } = opts;
        if (!ctx.user) {
            throw new server_2.TRPCError({ code: 'UNAUTHORIZED' });
        }
        return opts.next({
            ctx: {
                user: ctx.user,
            },
        });
    });
});
exports.router = exports.t.router;
exports.publicProcedure = exports.t.procedure;
