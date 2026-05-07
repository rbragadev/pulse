import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CommunityStatus, KudosPostStatus, Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('stats')
  getStats() {
    return this.adminService.getDashboard();
  }

  @Get('users')
  getUsers(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getUsers(+page, +limit);
  }

  @Patch('users/:id')
  updateUser(
    @Param('id') id: string,
    @Body() data: { isActive?: boolean; role?: Role; departmentId?: string | null },
  ) {
    return this.adminService.updateUser(id, data);
  }

  @Patch('users/:id/role')
  updateUserRole(@Param('id') id: string, @Body('role') role: 'USER' | 'ADMIN') {
    return this.adminService.updateUserRole(id, role);
  }

  @Get('categories')
  getCategories() {
    return this.adminService.getCategories();
  }

  @Post('categories')
  createCategory(
    @Body()
    dto: {
      name: string;
      description?: string;
      icon?: string;
      color?: string;
      weight?: number;
      isActive?: boolean;
    },
  ) {
    return this.adminService.createCategory(dto);
  }

  @Patch('categories/:id')
  updateCategory(
    @Param('id') id: string,
    @Body()
    dto: {
      name?: string;
      description?: string;
      icon?: string;
      color?: string;
      weight?: number;
      isActive?: boolean;
    },
  ) {
    return this.adminService.updateCategory(id, dto);
  }

  @Get('kudos')
  getKudos(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: KudosPostStatus,
  ) {
    return this.adminService.getKudos(+page, +limit, status);
  }

  @Get('posts')
  getPosts(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getKudos(+page, +limit);
  }

  @Patch('kudos/:id/status')
  updateKudosStatus(
    @Param('id') id: string,
    @Body('status') status: KudosPostStatus,
  ) {
    return this.adminService.updateKudosStatus(id, status);
  }

  @Get('rules')
  getRules() {
    return this.adminService.getRules();
  }

  @Post('rules')
  createRule(
    @Body()
    dto: { categoryId: string; points: number; weeklyLimit: number; cooldownHours: number },
  ) {
    return this.adminService.createRule(dto);
  }

  @Patch('rules/:id')
  updateRule(
    @Param('id') id: string,
    @Body() dto: { points?: number; weeklyLimit?: number; cooldownHours?: number },
  ) {
    return this.adminService.updateRule(id, dto);
  }

  // ─── Communities ──────────────────────────────────────────────────────────

  @Get('communities')
  getAdminCommunities(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.adminService.getAdminCommunities(+page, +limit);
  }

  @Post('communities')
  createOfficialCommunity(
    @CurrentUser() user: any,
    @Body()
    dto: {
      name: string;
      slug: string;
      description?: string;
      avatarUrl?: string;
      bannerUrl?: string;
      category?: string;
      language?: string;
      location?: string;
    },
  ) {
    return this.adminService.createOfficialCommunity({ ...dto, createdById: user.id });
  }

  @Patch('communities/:id')
  updateCommunity(
    @Param('id') id: string,
    @Body()
    dto: {
      name?: string;
      description?: string;
      avatarUrl?: string;
      bannerUrl?: string;
      category?: string;
      isOfficial?: boolean;
      status?: CommunityStatus;
    },
  ) {
    return this.adminService.updateCommunity(id, dto);
  }

  @Get('communities/:id/members')
  getCommunityMembers(@Param('id') id: string) {
    return this.adminService.getCommunityMembers(id);
  }

  @Patch('communities/:id/members/:userId/role')
  setCommunityMemberRole(
    @Param('id') communityId: string,
    @Param('userId') userId: string,
    @Body('role') role: 'MEMBER' | 'MODERATOR',
  ) {
    return this.adminService.setCommunityMemberRole(communityId, userId, role);
  }

  @Get('communities/:id/posts')
  getCommunityPosts(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.adminService.getCommunityPosts(id, +page, +limit);
  }

  @Patch('communities/posts/:postId/status')
  moderateCommunityPost(
    @Param('postId') postId: string,
    @Body('status') status: 'ACTIVE' | 'HIDDEN' | 'REMOVED',
  ) {
    return this.adminService.moderateCommunityPost(postId, status);
  }
}
