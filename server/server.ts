import express from 'express';
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';
import { initTRPC } from '@trpc/server';
import { createContext } from './middleware/context';
import { appRouter } from './routes/_app';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(cors());

app.use(express.json()); 


app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
