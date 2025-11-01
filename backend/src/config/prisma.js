import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// Создаем единственный экземпляр Prisma клиента
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

// Обработка graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;

