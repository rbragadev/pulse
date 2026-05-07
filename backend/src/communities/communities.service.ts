import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CommunitiesRepository } from './communities.repository';
import { CreateCommunityDto } from './dto/create-community.dto';
import { CreateCommunityPostDto } from './dto/create-post.dto';
import { CreateCommunityCommentDto } from './dto/create-comment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommunitiesService {
  constructor(
    private readonly repo: CommunitiesRepository,
    private readonly prisma: PrismaService,
  ) {}

  // ─── Communities ──────────────────────────────────────────────────────────

  findAll(requesterId?: string) {
    return this.repo.findAll(requesterId);
  }

  findMyCommunities(userId: string) {
    return this.repo.findMyCommunities(userId);
  }

  async findBySlug(slug: string, requesterId?: string) {
    const community = await this.repo.findBySlug(slug, requesterId);
    if (!community) throw new NotFoundException('Comunidade não encontrada');
    if (community.status === 'ARCHIVED') throw new NotFoundException('Comunidade arquivada');
    return community;
  }

  async create(createdById: string, dto: CreateCommunityDto) {
    const slug = dto.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const existing = await this.prisma.community.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Já existe uma comunidade com esse slug');

    return this.repo.create({ ...dto, slug, createdById });
  }

  async update(id: string, requesterId: string, data: Partial<CreateCommunityDto>, isAdmin = false) {
    const community = await this.repo.findById(id);
    if (!community) throw new NotFoundException('Comunidade não encontrada');

    if (!isAdmin) {
      const membership = await this.repo.findMembership(id, requesterId);
      if (!membership || (membership.role !== 'OWNER' && membership.role !== 'MODERATOR')) {
        throw new ForbiddenException('Sem permissão para editar esta comunidade');
      }
    }

    return this.repo.update(id, data);
  }

  // ─── Membership ───────────────────────────────────────────────────────────

  async join(communityId: string, userId: string) {
    const community = await this.repo.findById(communityId);
    if (!community) throw new NotFoundException('Comunidade não encontrada');
    if (community.status !== 'ACTIVE') throw new BadRequestException('Comunidade não está ativa');

    const existing = await this.repo.findMembership(communityId, userId);
    if (existing) throw new ConflictException('Você já é membro desta comunidade');

    return this.repo.join(communityId, userId);
  }

  async leave(communityId: string, userId: string) {
    const community = await this.repo.findById(communityId);
    if (!community) throw new NotFoundException('Comunidade não encontrada');

    const membership = await this.repo.findMembership(communityId, userId);
    if (!membership) throw new BadRequestException('Você não é membro desta comunidade');

    if (membership.role === 'OWNER') {
      const ownerCount = await this.repo.countOwners(communityId);
      if (ownerCount <= 1) {
        throw new ForbiddenException(
          'Você é o único proprietário. Transfira a propriedade antes de sair.',
        );
      }
    }

    return this.repo.leave(communityId, userId);
  }

  // ─── Posts ────────────────────────────────────────────────────────────────

  async findPosts(communityId: string, requesterId?: string) {
    const community = await this.repo.findById(communityId);
    if (!community) throw new NotFoundException('Comunidade não encontrada');
    return this.repo.findPosts(communityId, requesterId);
  }

  async createPost(communityId: string, authorId: string, dto: CreateCommunityPostDto) {
    const community = await this.repo.findById(communityId);
    if (!community) throw new NotFoundException('Comunidade não encontrada');

    const membership = await this.repo.findMembership(communityId, authorId);
    if (!membership) throw new ForbiddenException('Você precisa ser membro para postar');

    return this.repo.createPost({ communityId, authorId, ...dto });
  }

  async updatePostStatus(
    postId: string,
    status: 'ACTIVE' | 'HIDDEN' | 'REMOVED',
    requesterId: string,
    isAdmin = false,
  ) {
    const post = await this.repo.findPostById(postId);
    if (!post) throw new NotFoundException('Post não encontrado');

    if (!isAdmin) {
      const membership = await this.repo.findMembership(post.communityId, requesterId);
      if (!membership || membership.role === 'MEMBER') {
        throw new ForbiddenException('Sem permissão para moderar este post');
      }
    }

    return this.repo.updatePostStatus(postId, status as any);
  }

  // ─── Comments ─────────────────────────────────────────────────────────────

  async findComments(postId: string) {
    const post = await this.repo.findPostById(postId);
    if (!post) throw new NotFoundException('Post não encontrado');
    return this.repo.findComments(postId);
  }

  async addComment(postId: string, authorId: string, dto: CreateCommunityCommentDto) {
    const post = await this.repo.findPostById(postId);
    if (!post) throw new NotFoundException('Post não encontrado');
    return this.repo.createComment({ postId, authorId, content: dto.content });
  }

  async deleteComment(commentId: string, userId: string, isAdmin = false) {
    const comment = await this.repo.findComment(commentId);
    if (!comment) throw new NotFoundException('Comentário não encontrado');
    if (!isAdmin && comment.authorId !== userId) {
      throw new ForbiddenException('Você não pode deletar este comentário');
    }
    return this.repo.deleteComment(commentId);
  }

  // ─── Reactions ────────────────────────────────────────────────────────────

  async toggleReaction(postId: string, userId: string, reactionType: string) {
    const post = await this.repo.findPostById(postId);
    if (!post) throw new NotFoundException('Post não encontrado');

    const existing = await this.repo.findReaction(postId, userId, reactionType);
    if (existing) {
      await this.repo.deleteReaction(postId, userId, reactionType);
      return { reacted: false, reactionType };
    }
    await this.repo.createReaction(postId, userId, reactionType);
    return { reacted: true, reactionType };
  }

  getReactions(postId: string, userId?: string) {
    return this.repo.getReactions(postId, userId);
  }

  getUserCommunities(userId: string) {
    return this.repo.findUserCommunities(userId);
  }
}
