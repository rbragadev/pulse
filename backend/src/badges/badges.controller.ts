import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Role, BadgeRarity } from '@prisma/client';
import { BadgesService } from './badges.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('badges')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get()
  findAll() {
    return this.badgesService.findAll();
  }

  @Get('user/:userId')
  findUserBadges(@Param('userId') userId: string) {
    return this.badgesService.findUserBadges(userId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() body: { name: string; slug: string; description: string; icon: string; color: string; rarity: BadgeRarity }) {
    return this.badgesService.create(body);
  }

  @Post('user/:userId/award/:badgeId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  awardBadge(@Param('userId') userId: string, @Param('badgeId') badgeId: string) {
    return this.badgesService.awardBadge(userId, badgeId);
  }

  @Delete('user/:userId/revoke/:badgeId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  revokeBadge(@Param('userId') userId: string, @Param('badgeId') badgeId: string) {
    return this.badgesService.revokeBadge(userId, badgeId);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() body: Partial<{ name: string; slug: string; description: string; icon: string; color: string; rarity: BadgeRarity }>,
  ) {
    return this.badgesService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  deleteBadge(@Param('id') id: string) {
    return this.badgesService.delete(id);
  }
}
