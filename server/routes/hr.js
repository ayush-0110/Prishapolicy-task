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
exports.hrRouter = void 0;
const trpc_1 = require("./trpc");
const server_1 = require("@trpc/server");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const employeeSchema = zod_1.z.object({
    name: zod_1.z.string(),
    age: zod_1.z.number(),
    email: zod_1.z.string(),
    contactNumber: zod_1.z.string(),
    dependents: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        age: zod_1.z.number(),
        relation: zod_1.z.string(),
    })),
});
exports.hrRouter = (0, trpc_1.router)({
    addEmployee: trpc_1.protectedProcedure
        .input(employeeSchema)
        .mutation(({ input, ctx }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (((_a = ctx.user) === null || _a === void 0 ? void 0 : _a.role) !== "HR_MANAGER") {
            throw new server_1.TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
        }
        const employee = yield prisma.employee.create({
            data: {
                name: input.name,
                age: input.age,
                email: input.email,
                contactNumber: input.contactNumber,
                dependents: {
                    create: input.dependents,
                },
            },
        });
        return employee;
    })),
    listAllEmployees: trpc_1.protectedProcedure
        .use(({ ctx, next }) => {
        var _a;
        if (((_a = ctx.user) === null || _a === void 0 ? void 0 : _a.role) !== client_1.Role.HR_MANAGER) {
            throw new server_1.TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
        }
        return next();
    })
        .query(() => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.employee.findMany({
            include: {
                dependents: true,
            },
        });
    })),
    deleteEmployee: trpc_1.protectedProcedure
        .input(zod_1.z.object({ employeeId: zod_1.z.number() }))
        .mutation(({ input, ctx }) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        if (((_b = ctx.user) === null || _b === void 0 ? void 0 : _b.role) !== "HR_MANAGER") {
            throw new server_1.TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
        }
        try {
            const deletedEmployee = yield prisma.employee.delete({
                where: { id: input.employeeId },
            });
            return deletedEmployee;
        }
        catch (error) {
            throw new server_1.TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to delete the employee",
            });
        }
    })),
    uploadEmployees: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        employees: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string(),
            age: zod_1.z.number(),
            email: zod_1.z.string(),
            contactNumber: zod_1.z.string(),
            dependents: zod_1.z.array(zod_1.z.any()),
        })),
    }))
        .mutation(({ input, ctx }) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        if (((_c = ctx.user) === null || _c === void 0 ? void 0 : _c.role) !== "HR_MANAGER") {
            throw new server_1.TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
        }
        try {
            const result = yield prisma.employee.createMany({
                data: input.employees.map(emp => ({
                    name: emp.name,
                    age: emp.age,
                    email: emp.email,
                    contactNumber: emp.contactNumber,
                })),
                skipDuplicates: true,
            });
            return {
                status: "Success",
                message: `Inserted ${result.count} employees.`,
            };
        }
        catch (error) {
            console.error("Error:", error);
            throw new server_1.TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to process employees",
            });
        }
    })),
});
