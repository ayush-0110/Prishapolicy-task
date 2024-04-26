import { router, publicProcedure } from './trpc';
import { z } from 'zod';
import { PrismaClient, Role } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { hashPassword, verifyPassword, createToken } from '../middleware/auth';

const prisma = new PrismaClient();

const createUserInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role),
});

function handleZodError(error: z.ZodError) {
  const errorMessage = error.issues.map(issue => issue.message).join('; ');
  throw new TRPCError({
    code: 'BAD_REQUEST',
    message: `Validation failed: ${errorMessage}`
  });
}


export const authRouter = router({
  register: publicProcedure.input(createUserInput).mutation(async ({ input, ctx }) => {
    try {
    const existingUser = await prisma.user.findUnique({ where: { email: input.email } });
    if (existingUser) {
      throw new TRPCError({ code: 'CONFLICT', message: 'User already exists with this email' });
    }
    const hashedPassword = await hashPassword(input.password);
    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        role: input.role
      }
    });
    return { status: 'success', message: 'Registration successful!', userId: user.id  };
  }catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    }
    throw error;
  }
  }),
  login: publicProcedure.input(createUserInput).mutation(async ({ input, ctx }) => {
    try{
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'No user found with this email' });
    }
    if (!await verifyPassword(input.password, user.password)) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
    }
    if (user.role !== input.role) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Role does not match' });
    }
    const token = createToken(user.id, user.role, user.email);
    return { status: 'success', message: 'Logged in successfully!', token };
  }catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    }
    throw error;
  }
  }),
});
