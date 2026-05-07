import { Module } from '@nestjs/common';
import { KudosService } from './kudos.service';
import { KudosController } from './kudos.controller';
import { KudosRepository } from './kudos.repository';
import { AchievementsModule } from '../achievements/achievements.module';

@Module({
  imports: [AchievementsModule],
  providers: [KudosService, KudosRepository],
  controllers: [KudosController],
  exports: [KudosService],
})
export class KudosModule {}
