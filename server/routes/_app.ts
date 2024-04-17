import { router } from './trpc';
import { authRouter } from './auth';
import { hrRouter } from './hr';
import { employeeRouter } from './employee';

export const appRouter = router({
  auth: authRouter,
  hr: hrRouter,
  employee: employeeRouter
});

export type AppRouter = typeof appRouter;
