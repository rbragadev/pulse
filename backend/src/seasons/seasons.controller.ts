import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SeasonsService } from './seasons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('seasons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('seasons')
export class SeasonsController {
  constructor(private readonly seasonsService: SeasonsService) {}

  @Get()
  findAll() {
    return this.seasonsService.findAll();
  }

  @Get('active')
  findActive() {
    return this.seasonsService.findActive();
  }

  @Get('hall-of-fame')
  getHallOfFame() {
    return this.seasonsService.getHallOfFame();
  }

  @Post('snapshot')
  snapshot() {
    return this.seasonsService.snapshotActiveSeason();
  }
}
