import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RankingService } from './ranking.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('ranking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get('galacticos')
  getGalacticos(@Query('year') year?: string, @Query('month') month?: string) {
    return this.rankingService.getGalacticosRanking(
      year ? +year : undefined,
      month ? +month - 1 : undefined,
    );
  }

  @Get('monthly')
  getMonthly(@Query('year') year?: string, @Query('month') month?: string) {
    return this.rankingService.getMonthlyRanking(
      year ? +year : undefined,
      month ? +month - 1 : undefined,
    );
  }

  @Get('all-time')
  getAllTime() {
    return this.rankingService.getAllTimeRanking();
  }
}
