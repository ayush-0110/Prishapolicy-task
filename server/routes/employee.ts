import { router, protectedProcedure } from "./trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const employeeRouter = router({
  getEmployee: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user?.email !== input.email) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access denied",
        });
      }

      const employee = await prisma.employee.findUnique({
        where: { email: input.email },
        include: { dependents: true },
      });

      if (!employee) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Employee not found",
        });
      }

      return employee;
    }),

  addDependent: protectedProcedure
    .input(
      z.object({
        employeeId: z.number(),
        email: z.string().email(),
        name: z.string(),
        age: z.number(),
        relation: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.email !== input.email) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not allowed to add dependents for other employees",
        });
      }

      const dependent = await prisma.dependent.create({
        data: {
          name: input.name,
          age: input.age,
          relation: input.relation,
          employeeId: input.employeeId,
        },
      });

      return dependent;
    }),

  updateDependent: protectedProcedure
    .input(
      z.object({
        dependentId: z.number(),
        updates: z.object({
          name: z.string().optional(),
          age: z.number().optional(),
          relation: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const dependent = await prisma.dependent.findUnique({
        where: { id: input.dependentId },
        include: { employee: true },
      });

      if (!dependent || dependent.employee.email !== ctx.user?.email) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not allowed to update this dependent",
        });
      }

      const updatedDependent = await prisma.dependent.update({
        where: { id: input.dependentId },
        data: input.updates,
      });

      return updatedDependent;
    }),

  deleteDependent: protectedProcedure
    .input(
      z.object({
        dependentId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const dependent = await prisma.dependent.findUnique({
        where: { id: input.dependentId },
        include: { employee: true },
      });

      if (!dependent || dependent.employee.email !== ctx.user?.email) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not allowed to delete this dependent",
        });
      }

      const deletedDependent = await prisma.dependent.delete({
        where: { id: input.dependentId },
      });

      return deletedDependent;
    }),
});
