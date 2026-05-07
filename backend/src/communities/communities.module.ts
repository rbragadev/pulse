import { Module } from '@nestjs/common';
import { CommunitiesController } from './communities.controller';
import { CommunitiesService } from './communities.service';
import { CommunitiesRepository } from './communities.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CommunitiesController],
  providers: [CommunitiesService, CommunitiesRepository],
  exports: [CommunitiesService, CommunitiesRepository],
})
export class CommunitiesModule {}
