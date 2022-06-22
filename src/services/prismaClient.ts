import { PrismaClient } from '@prisma/client'

// As per the docs, there should be only one instance of prisma running.
const prisma = new PrismaClient()

export { prisma }
