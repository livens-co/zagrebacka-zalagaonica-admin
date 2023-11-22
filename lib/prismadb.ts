import { PrismaClient } from "@prisma/client/edge";
import {withAccelerate} from "@prisma/extension-accelerate"

declare global {
  var prisma: PrismaClient | undefined
}

// const prismadb = globalThis.prisma || new PrismaClient();
// if(process.env.NODE_ENV !== 'production') globalThis.prisma = prismadb;
const prismadb = new PrismaClient().$extends(withAccelerate());

export default prismadb;