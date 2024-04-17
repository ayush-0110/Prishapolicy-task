import { initTRPC } from '@trpc/server';
import { TRPCError } from '@trpc/server';
import { Context } from '../middleware/context';

export const t = initTRPC.context<Context>().create();

export const protectedProcedure = t.procedure.use(async function isAuthed(opts) {
    const { ctx } = opts;
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return opts.next({
      ctx: {
        user: ctx.user, 
      },
    });
  });

export const router = t.router;
export const publicProcedure = t.procedure;
