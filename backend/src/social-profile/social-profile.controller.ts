import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { VoteType } from '@prisma/client';
import { SocialProfileService } from './social-profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('social-profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('social-profile')
export class SocialProfileController {
  constructor(private readonly socialProfileService: SocialProfileService) {}

  @Get(':userId')
  async getFullProfile(@Param('userId') userId: string, @CurrentUser() requester: any) {
    await this.socialProfileService.recordVisit(requester.id, userId);
    return this.socialProfileService.getFullProfile(userId, requester.id);
  }

  @Post(':userId/vote')
  vote(
    @Param('userId') targetId: string,
    @CurrentUser() requester: any,
    @Body() body: { type: VoteType },
  ) {
    return this.socialProfileService.vote(requester.id, targetId, body.type);
  }
}
