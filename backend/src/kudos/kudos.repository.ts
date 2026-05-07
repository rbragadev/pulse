import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

const postInclude = {
  author: { include: { department: true } },
  recipient: { include: { department: true } },
  category: true,
  _count: { select: { likes: true, comments: true } },
};

@Injectable()
export class KudosRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(params: { skip?: number; take?: number; where?: Prisma.KudosPostWhereInput }) {
    return this.prisma.kudosPost.findMany({
      ...params,
      include: postInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findFeed(
    userId: string,
    params: { skip?: number; take?: number; where?: Prisma.KudosPostWhereInput },
  ) {
    const posts = await this.prisma.kudosPost.findMany({
      ...params,
      include: {
        ...postInclude,
        likes: { where: { userId }, select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return posts.map(({ likes, ...post }) => ({
      ...post,
      likedByMe: likes.length > 0,
    }));
  }

  count(where?: Prisma.KudosPostWhereInput) {
    return this.prisma.kudosPost.count({ where });
  }

  findById(id: string) {
    return this.prisma.kudosPost.findUnique({
      where: { id },
      include: postInclude,
    });
  }

  create(data: Prisma.KudosPostCreateInput) {
    return this.prisma.kudosPost.create({
      data,
      include: postInclude,
    });
  }

  findLike(userId: string, postId: string) {
    return this.prisma.kudosLike.findUnique({
      where: { userId_postId: { userId, postId } },
    });
  }

  createLike(userId: string, postId: string) {
    return this.prisma.kudosLike.create({
      data: { userId, postId },
    });
  }

  deleteLike(userId: string, postId: string) {
    return this.prisma.kudosLike.delete({
      where: { userId_postId: { userId, postId } },
    });
  }

  findCategories() {
    return this.prisma.kudosCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  findCategoryById(id: string) {
    return this.prisma.kudosCategory.findUnique({ where: { id } });
  }

  createCategory(data: { name: string; description?: string; icon?: string; color?: string }) {
    return this.prisma.kudosCategory.create({ data });
  }

  deleteCategory(id: string) {
    return this.prisma.kudosCategory.delete({ where: { id } });
  }
}
