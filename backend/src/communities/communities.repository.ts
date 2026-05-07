import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommunityPostStatus, CommunityStatus } from '@prisma/client';

const memberSelect = {
  id: true,
  name: true,
  avatar: true,
  departmentId: true,
  department: { select: { id: true, name: true, color: true } },
};

@Injectable()
export class CommunitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Communities ──────────────────────────────────────────────────────────

  async findAll(requesterId?: string) {
    const communities = await this.prisma.community.findMany({
      where: { status: CommunityStatus.ACTIVE },
      include: {
        createdBy: { select: memberSelect },
        _count: { select: { members: true, posts: true } },
      },
      orderBy: [{ isOfficial: 'desc' }, { createdAt: 'desc' }],
    });

    if (!requesterId) return communities.map((c) => ({ ...c, isMember: false }));

    const memberships = await this.prisma.communityMember.findMany({
      where: { userId: requesterId },
      select: { communityId: true },
    });
    const memberSet = new Set(memberships.map((m) => m.communityId));

    return communities.map((c) => ({ ...c, isMember: memberSet.has(c.id) }));
  }

  async findMyCommunities(userId: string) {
    const [memberships, created, moderated] = await Promise.all([
      this.prisma.communityMember.findMany({
        where: { userId, role: 'MEMBER' },
        include: {
          community: {
            include: {
              _count: { select: { members: true, posts: true } },
              createdBy: { select: memberSelect },
            },
          },
        },
      }),
      this.prisma.community.findMany({
        where: { createdById: userId, status: { not: CommunityStatus.ARCHIVED } },
        include: { _count: { select: { members: true, posts: true } } },
      }),
      this.prisma.communityMember.findMany({
        where: { userId, role: 'MODERATOR' },
        include: {
          community: {
            include: { _count: { select: { members: true, posts: true } } },
          },
        },
      }),
    ]);

    return {
      communitiesIMember: memberships.map((m) => ({ ...m.community, isMember: true })),
      communitiesICreated: created.map((c) => ({ ...c, isMember: true })),
      communitiesIModerate: moderated.map((m) => ({ ...m.community, isMember: true })),
    };
  }

  async findBySlug(slug: string, requesterId?: string) {
    const community = await this.prisma.community.findUnique({
      where: { slug },
      include: {
        createdBy: { select: memberSelect },
        _count: { select: { members: true, posts: true } },
        members: {
          orderBy: { joinedAt: 'asc' },
          take: 12,
          include: { user: { select: memberSelect } },
        },
      },
    });

    if (!community) return null;

    const owner = await this.prisma.communityMember.findFirst({
      where: { communityId: community.id, role: 'OWNER' },
      include: { user: { select: memberSelect } },
    });

    const moderators = await this.prisma.communityMember.findMany({
      where: { communityId: community.id, role: 'MODERATOR' },
      include: { user: { select: memberSelect } },
    });

    let isMember = false;
    let userRole: string | null = null;
    if (requesterId) {
      const membership = await this.prisma.communityMember.findUnique({
        where: { communityId_userId: { communityId: community.id, userId: requesterId } },
      });
      isMember = !!membership;
      userRole = membership?.role ?? null;
    }

    const recentPosts = await this.prisma.communityPost.findMany({
      where: { communityId: community.id, status: CommunityPostStatus.ACTIVE },
      include: {
        author: { select: memberSelect },
        _count: { select: { comments: true, reactions: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return {
      ...community,
      isMember,
      userRole,
      owner: owner?.user ?? community.createdBy,
      moderators: moderators.map((m) => m.user),
      recentMembers: community.members.map((m) => m.user),
      recentPosts,
    };
  }

  findById(id: string) {
    return this.prisma.community.findUnique({ where: { id } });
  }

  create(data: {
    name: string;
    slug: string;
    description?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    category?: string;
    language?: string;
    location?: string;
    visibility?: 'PUBLIC' | 'PRIVATE';
    isOfficial?: boolean;
    createdById: string;
  }) {
    return this.prisma.community.create({
      data: {
        ...data,
        members: { create: { userId: data.createdById, role: 'OWNER' } },
      },
      include: { _count: { select: { members: true, posts: true } } },
    });
  }

  update(
    id: string,
    data: {
      name?: string;
      description?: string;
      avatarUrl?: string;
      bannerUrl?: string;
      category?: string;
      language?: string;
      location?: string;
      isOfficial?: boolean;
      status?: CommunityStatus;
    },
  ) {
    return this.prisma.community.update({ where: { id }, data });
  }

  // ─── Membership ───────────────────────────────────────────────────────────

  findMembership(communityId: string, userId: string) {
    return this.prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId } },
    });
  }

  join(communityId: string, userId: string) {
    return this.prisma.communityMember.create({
      data: { communityId, userId, role: 'MEMBER' },
    });
  }

  leave(communityId: string, userId: string) {
    return this.prisma.communityMember.delete({
      where: { communityId_userId: { communityId, userId } },
    });
  }

  countOwners(communityId: string) {
    return this.prisma.communityMember.count({ where: { communityId, role: 'OWNER' } });
  }

  setMemberRole(communityId: string, userId: string, role: 'MEMBER' | 'MODERATOR' | 'OWNER') {
    return this.prisma.communityMember.update({
      where: { communityId_userId: { communityId, userId } },
      data: { role },
    });
  }

  // ─── Posts ────────────────────────────────────────────────────────────────

  async findPosts(communityId: string, requesterId?: string) {
    const posts = await this.prisma.communityPost.findMany({
      where: { communityId, status: CommunityPostStatus.ACTIVE },
      include: {
        author: { select: memberSelect },
        _count: { select: { comments: true, reactions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!requesterId) return posts.map((p) => ({ ...p, myReactions: [] as string[] }));

    return Promise.all(
      posts.map(async (post) => {
        const myRaw = await this.prisma.communityPostReaction.findMany({
          where: { postId: post.id, userId: requesterId },
        });
        return { ...post, myReactions: myRaw.map((r) => r.reactionType) };
      }),
    );
  }

  async findPostById(postId: string) {
    return this.prisma.communityPost.findUnique({
      where: { id: postId },
      include: { author: { select: memberSelect } },
    });
  }

  createPost(data: { communityId: string; authorId: string; title: string; content: string }) {
    return this.prisma.communityPost.create({
      data,
      include: {
        author: { select: memberSelect },
        _count: { select: { comments: true, reactions: true } },
      },
    });
  }

  updatePostStatus(postId: string, status: CommunityPostStatus) {
    return this.prisma.communityPost.update({ where: { id: postId }, data: { status } });
  }

  // ─── Comments ─────────────────────────────────────────────────────────────

  findComments(postId: string) {
    return this.prisma.communityPostComment.findMany({
      where: { postId },
      include: { author: { select: memberSelect } },
      orderBy: { createdAt: 'asc' },
    });
  }

  createComment(data: { postId: string; authorId: string; content: string }) {
    return this.prisma.communityPostComment.create({
      data,
      include: { author: { select: memberSelect } },
    });
  }

  deleteComment(commentId: string) {
    return this.prisma.communityPostComment.delete({ where: { id: commentId } });
  }

  findComment(commentId: string) {
    return this.prisma.communityPostComment.findUnique({ where: { id: commentId } });
  }

  // ─── Reactions ────────────────────────────────────────────────────────────

  async getReactions(postId: string, userId?: string) {
    const grouped = await this.prisma.communityPostReaction.groupBy({
      by: ['reactionType'],
      where: { postId },
      _count: { id: true },
    });

    let myReactions: string[] = [];
    if (userId) {
      const mine = await this.prisma.communityPostReaction.findMany({
        where: { postId, userId },
      });
      myReactions = mine.map((r) => r.reactionType);
    }

    return {
      reactions: grouped.map((r) => ({ type: r.reactionType, count: r._count.id })),
      myReactions,
    };
  }

  findReaction(postId: string, userId: string, reactionType: string) {
    return this.prisma.communityPostReaction.findUnique({
      where: { postId_userId_reactionType: { postId, userId, reactionType: reactionType as any } },
    });
  }

  createReaction(postId: string, userId: string, reactionType: string) {
    return this.prisma.communityPostReaction.create({
      data: { postId, userId, reactionType: reactionType as any },
    });
  }

  deleteReaction(postId: string, userId: string, reactionType: string) {
    return this.prisma.communityPostReaction.deleteMany({
      where: { postId, userId, reactionType: reactionType as any },
    });
  }

  // ─── Admin helpers ────────────────────────────────────────────────────────

  findAllAdmin(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return Promise.all([
      this.prisma.community.findMany({
        skip,
        take: limit,
        include: { _count: { select: { members: true, posts: true } }, createdBy: { select: memberSelect } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.community.count(),
    ]);
  }

  findCommunityMembers(communityId: string) {
    return this.prisma.communityMember.findMany({
      where: { communityId },
      include: { user: { select: memberSelect } },
      orderBy: [{ role: 'asc' }, { joinedAt: 'asc' }],
    });
  }

  findCommunityPosts(communityId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    return Promise.all([
      this.prisma.communityPost.findMany({
        where: { communityId },
        skip,
        take: limit,
        include: { author: { select: memberSelect }, _count: { select: { comments: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.communityPost.count({ where: { communityId } }),
    ]);
  }

  findUserCommunities(userId: string) {
    return this.prisma.communityMember.findMany({
      where: { userId },
      include: {
        community: {
          select: {
            id: true,
            name: true,
            slug: true,
            avatarUrl: true,
            isOfficial: true,
            status: true,
            _count: { select: { members: true } },
          },
        },
      },
    });
  }
}
