"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("./trpc");
const auth_1 = require("./auth");
const hr_1 = require("./hr");
const employee_1 = require("./employee");
exports.appRouter = (0, trpc_1.router)({
    auth: auth_1.authRouter,
    hr: hr_1.hrRouter,
    employee: employee_1.employeeRouter
});
