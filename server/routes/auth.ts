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

export const authRouter = router({
  register: publicProcedure.input(createUserInput).mutation(async ({ input, ctx }) => {
    const hashedPassword = await hashPassword(input.password);
    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        role: input.role
      }
    });
    return { status: 'success', message: 'Registration successful!', userId: user.id  };
  }),
  login: publicProcedure.input(createUserInput).mutation(async ({ input, ctx }) => {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !await verifyPassword(input.password, user.password) || user.role!==input.role) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
    }
    const token = createToken(user.id, user.role, user.email);
    return { status: 'success', message: 'Logged in successfully!', token };
  }),
});
