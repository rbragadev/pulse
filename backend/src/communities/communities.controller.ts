import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CommunitiesService } from './communities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateCommunityDto } from './dto/create-community.dto';
import { CreateCommunityPostDto } from './dto/create-post.dto';
import { CreateCommunityCommentDto } from './dto/create-comment.dto';

@ApiTags('communities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('communities')
export class CommunitiesController {
  constructor(private readonly service: CommunitiesService) {}

  // ─── Communities ──────────────────────────────────────────────────────────

  @Get()
  findAll(@CurrentUser() user: any, @Query('search') search?: string) {
    return this.service.findAll(user?.id);
  }

  @Get('my')
  findMy(@CurrentUser() user: any) {
    return this.service.findMyCommunities(user.id);
  }

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateCommunityDto) {
    return this.service.create(user.id, dto);
  }

  // Static routes BEFORE :slug
  @Get('posts/:postId/comments')
  getComments(@Param('postId') postId: string) {
    return this.service.findComments(postId);
  }

  @Post('posts/:postId/comments')
  addComment(
    @CurrentUser() user: any,
    @Param('postId') postId: string,
    @Body() dto: CreateCommunityCommentDto,
  ) {
    return this.service.addComment(postId, user.id, dto);
  }

  @Delete('posts/:postId/comments/:commentId')
  deleteComment(
    @CurrentUser() user: any,
    @Param('commentId') commentId: string,
  ) {
    return this.service.deleteComment(commentId, user.id);
  }

  @Get('posts/:postId/reactions')
  getReactions(@CurrentUser() user: any, @Param('postId') postId: string) {
    return this.service.getReactions(postId, user?.id);
  }

  @Post('posts/:postId/reactions')
  toggleReaction(
    @CurrentUser() user: any,
    @Param('postId') postId: string,
    @Body() body: { reactionType: string },
  ) {
    return this.service.toggleReaction(postId, user.id, body.reactionType);
  }

  @Patch('posts/:postId/status')
  updatePostStatus(
    @CurrentUser() user: any,
    @Param('postId') postId: string,
    @Body('status') status: 'ACTIVE' | 'HIDDEN' | 'REMOVED',
  ) {
    return this.service.updatePostStatus(postId, status, user.id);
  }

  // ─── Dynamic :slug routes ─────────────────────────────────────────────────

  @Get(':slug')
  findOne(@Param('slug') slug: string, @CurrentUser() user: any) {
    return this.service.findBySlug(slug, user?.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: Partial<CreateCommunityDto>,
  ) {
    return this.service.update(id, user.id, dto);
  }

  @Post(':id/join')
  join(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.join(id, user.id);
  }

  @Post(':id/leave')
  leave(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.leave(id, user.id);
  }

  @Get(':id/posts')
  getPosts(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.findPosts(id, user?.id);
  }

  @Post(':id/posts')
  createPost(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: CreateCommunityPostDto,
  ) {
    return this.service.createPost(id, user.id, dto);
  }
}
