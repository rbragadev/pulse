import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { KudosService } from './kudos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateKudosDto } from './dto/create-kudos.dto';
import { KudosQueryDto } from './dto/kudos-query.dto';

@ApiTags('kudos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('kudos')
export class KudosController {
  constructor(private readonly kudosService: KudosService) {}

  @Get('feed')
  getFeed(@CurrentUser() user: any, @Query() query: KudosQueryDto) {
    return this.kudosService.getFeed(user.id, query);
  }

  @Get('categories')
  getCategories() {
    return this.kudosService.findCategories();
  }

  @Get()
  findAll(@Query() query: KudosQueryDto) {
    return this.kudosService.findAll(query);
  }

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateKudosDto) {
    return this.kudosService.create(user.id, dto);
  }

  @Post(':id/like')
  addLike(@CurrentUser() user: any, @Param('id') postId: string) {
    return this.kudosService.addLike(user.id, postId);
  }

  @Delete(':id/like')
  removeLike(@CurrentUser() user: any, @Param('id') postId: string) {
    return this.kudosService.removeLike(user.id, postId);
  }

  @Post('categories')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  createCategory(@Body() dto: { name: string; description?: string; icon?: string; color?: string }) {
    return this.kudosService.createCategory(dto);
  }

  @Delete('categories/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  deleteCategory(@Param('id') id: string) {
    return this.kudosService.deleteCategory(id);
  }
}
