import { Request } from 'express';
import { Role } from '@prisma/client';
import { decodeAndVerifyJwtToken } from './auth';

export type Context = {
  user?: {
    userId: number;
    email: string;
    role: Role;
  }
};

export async function createContext({ req }: { req: Request}): Promise<Context> {
    async function getUserFromHeader() {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(' ')[1]; 
        return await decodeAndVerifyJwtToken(token);
      }
      return undefined;
    }
  
    const user = await getUserFromHeader();

    if(!user)return {};

    return { user };
  }