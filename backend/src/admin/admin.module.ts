import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CommunitiesModule } from '../communities/communities.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, CommunitiesModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
