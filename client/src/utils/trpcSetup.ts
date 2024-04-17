import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../server/routes/_app';

export const trpc = createTRPCReact<AppRouter>();
