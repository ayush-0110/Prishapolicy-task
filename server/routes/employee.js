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
exports.employeeRouter = void 0;
const trpc_1 = require("./trpc");
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.employeeRouter = (0, trpc_1.router)({
    getEmployee: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        email: zod_1.z.string().email(),
    }))
        .query(({ input, ctx }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (((_a = ctx.user) === null || _a === void 0 ? void 0 : _a.email) !== input.email) {
            throw new server_1.TRPCError({
                code: "FORBIDDEN",
                message: "Access denied",
            });
        }
        const employee = yield prisma.employee.findUnique({
            where: { email: input.email },
            include: { dependents: true },
        });
        if (!employee) {
            throw new server_1.TRPCError({
                code: "NOT_FOUND",
                message: "Employee not found",
            });
        }
        return employee;
    })),
    addDependent: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        employeeId: zod_1.z.number(),
        email: zod_1.z.string().email(),
        name: zod_1.z.string(),
        age: zod_1.z.number(),
        relation: zod_1.z.string(),
    }))
        .mutation(({ input, ctx }) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        if (((_b = ctx.user) === null || _b === void 0 ? void 0 : _b.email) !== input.email) {
            throw new server_1.TRPCError({
                code: "FORBIDDEN",
                message: "Not allowed to add dependents for other employees",
            });
        }
        const dependent = yield prisma.dependent.create({
            data: {
                name: input.name,
                age: input.age,
                relation: input.relation,
                employeeId: input.employeeId,
            },
        });
        return dependent;
    })),
    updateDependent: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        dependentId: zod_1.z.number(),
        updates: zod_1.z.object({
            name: zod_1.z.string().optional(),
            age: zod_1.z.number().optional(),
            relation: zod_1.z.string().optional(),
        }),
    }))
        .mutation(({ input, ctx }) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const dependent = yield prisma.dependent.findUnique({
            where: { id: input.dependentId },
            include: { employee: true },
        });
        if (!dependent || dependent.employeeId !== ((_c = ctx.user) === null || _c === void 0 ? void 0 : _c.userId)) {
            throw new server_1.TRPCError({
                code: "FORBIDDEN",
                message: "Not allowed to update this dependent",
            });
        }
        const updatedDependent = yield prisma.dependent.update({
            where: { id: input.dependentId },
            data: input.updates,
        });
        return updatedDependent;
    })),
    deleteDependent: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        dependentId: zod_1.z.number(),
    }))
        .mutation(({ input, ctx }) => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        const dependent = yield prisma.dependent.findUnique({
            where: { id: input.dependentId },
        });
        if (!dependent || dependent.employeeId !== ((_d = ctx.user) === null || _d === void 0 ? void 0 : _d.userId)) {
            throw new server_1.TRPCError({
                code: "FORBIDDEN",
                message: "Not allowed to delete this dependent",
            });
        }
        const deletedDependent = yield prisma.dependent.delete({
            where: { id: input.dependentId },
        });
        return deletedDependent;
    })),
});
