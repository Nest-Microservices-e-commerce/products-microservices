import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

  async onModuleInit() {
    const logger = new Logger("PrismaService.onModuleInit")
    await this.$connect();
    logger.log('Database connected');
  }

  async onModuleDestroy() {
    const logger = new Logger("PrismaService.onModuleDestroy")
    await this.$disconnect();
    logger.log('Database disconnected');
  }
}
