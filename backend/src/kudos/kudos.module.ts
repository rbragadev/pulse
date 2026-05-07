import { Module } from '@nestjs/common';
import { KudosService } from './kudos.service';
import { KudosController } from './kudos.controller';
import { KudosRepository } from './kudos.repository';

@Module({
  providers: [KudosService, KudosRepository],
  controllers: [KudosController],
  exports: [KudosService],
})
export class KudosModule {}
