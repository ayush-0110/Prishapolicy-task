import { router, protectedProcedure } from "./trpc";
import { TRPCError } from "@trpc/server";
import { PrismaClient, Role } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const employeeSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string(),
  contactNumber: z.string(),
  dependents: z.array(
    z.object({
      name: z.string(),
      age: z.number(),
      relation: z.string(),
    })
  ),
});

type Employee = z.infer<typeof employeeSchema>;

export const hrRouter = router({
  addEmployee: protectedProcedure
    .input(employeeSchema)
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "HR_MANAGER") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }

      const employee = await prisma.employee.create({
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
    }),

  listAllEmployees: protectedProcedure
    .use(({ ctx, next }) => {
      if (ctx.user?.role !== Role.HR_MANAGER) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }
      return next();
    })
    .query(async () => {
      return await prisma.employee.findMany({
        include: {
          dependents: true,
        },
      });
    }),

  deleteEmployee: protectedProcedure
    .input(z.object({ employeeId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "HR_MANAGER") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }

      try {
        const deletedEmployee = await prisma.employee.delete({
          where: { id: input.employeeId },
        });
        return deletedEmployee;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete the employee",
        });
      }
    }),

  uploadEmployees: protectedProcedure
    .input(
      z.object({
        employees: z.array(
          z.object({
            name: z.string(),
            age: z.number(),
            email: z.string(),
            contactNumber: z.string(),
            dependents: z.array(z.any()),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "HR_MANAGER") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }

      try {
        const result = await prisma.employee.createMany({
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
      } catch (error) {
        console.error("Error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to process employees",
        });
      }
    }),
});
