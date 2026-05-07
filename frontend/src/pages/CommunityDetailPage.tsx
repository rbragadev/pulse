import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Globe, Lock, Star, ArrowLeft, MessageSquare,
  ChevronDown, ChevronUp, Send, Plus,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useToast } from '@/hooks/useToast';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import UserAvatar from '@/components/shared/UserAvatar';
import { CommunityDetail, CommunityPost, CommunityPostComment } from '@/types';
import { cn, formatRelativeTime } from '@/lib/utils';

const REACTIONS = [
  { type: 'FIRE', emoji: '🔥' },
  { type: 'ROCKET', emoji: '🚀' },
  { type: 'HEART', emoji: '❤️' },
  { type: 'CLAP', emoji: '👏' },
  { type: 'BRAIN', emoji: '🧠' },
];

// ─── Post card ────────────────────────────────────────────────────────────────

function PostCard({ post, communityId }: { readonly post: CommunityPost; readonly communityId: string }) {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const { data: commentsData } = useQuery({
    queryKey: ['community-post-comments', post.id],
    queryFn: () => api.get(`/communities/posts/${post.id}/comments`).then((r) => r.data?.data ?? r.data),
    enabled: showComments,
  });

  const comments: CommunityPostComment[] = Array.isArray(commentsData) ? commentsData : [];

  const reactionMutation = useMutation({
    mutationFn: (reactionType: string) =>
      api.post(`/communities/posts/${post.id}/reactions`, { reactionType }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['community-posts', communityId] }),
    onError: () => toast({ title: 'Erro ao reagir', variant: 'destructive' }),
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) =>
      api.post(`/communities/posts/${post.id}/comments`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-post-comments', post.id] });
      queryClient.invalidateQueries({ queryKey: ['community-posts', communityId] });
      setNewComment('');
    },
    onError: () => toast({ title: 'Erro ao comentar', variant: 'destructive' }),
  });

  const handleComment = () => {
    if (newComment.trim().length < 1) return;
    commentMutation.mutate(newComment.trim());
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-border/80 transition-colors">
      <div className="p-4">
        {/* Author */}
        <div className="flex items-center gap-2.5 mb-3">
          <Link to={`/profile/${post.author.id}`}>
            <UserAvatar name={post.author.name} avatar={post.author.avatar} size="sm" />
          </Link>
          <div>
            <Link to={`/profile/${post.author.id}`} className="text-xs font-semibold text-foreground hover:text-primary transition-colors">
              {post.author.name}
            </Link>
            <p className="text-[10px] text-muted-foreground">{formatRelativeTime(post.createdAt)}</p>
          </div>
        </div>

        {/* Content */}
        <h3 className="font-semibold text-sm text-foreground mb-1.5 leading-snug">{post.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>

        {/* Reactions */}
        <div className="flex items-center gap-1 mt-3 flex-wrap">
          {REACTIONS.map(({ type, emoji }) => {
            const isActive = post.myReactions?.includes(type);
            return (
              <button
                key={type}
                onClick={() => reactionMutation.mutate(type)}
                className={cn(
                  'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all border',
                  isActive
                    ? 'bg-primary/15 border-primary/30 text-primary'
                    : 'bg-secondary border-border text-muted-foreground hover:border-primary/30 hover:text-foreground',
                )}
              >
                <span>{emoji}</span>
              </button>
            );
          })}

          <button
            onClick={() => setShowComments((v) => !v)}
            className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {post._count?.comments ?? 0}
            {showComments ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="border-t border-border bg-secondary/30 px-4 py-3 space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2">
              <Link to={`/profile/${c.author.id}`} className="shrink-0">
                <UserAvatar name={c.author.name} avatar={c.author.avatar} size="xs" />
              </Link>
              <div className="flex-1 bg-card rounded-xl px-3 py-2 min-w-0">
                <span className="text-xs font-semibold text-foreground">{c.author.name}</span>
                <span className="text-xs text-muted-foreground ml-1.5">{formatRelativeTime(c.createdAt)}</span>
                <p className="text-xs text-foreground/90 mt-0.5 leading-relaxed">{c.content}</p>
              </div>
            </div>
          ))}

          {user && (
            <div className="flex gap-2 pt-1">
              <UserAvatar name={user.name} avatar={user.avatar} size="xs" className="shrink-0" />
              <div className="flex-1 flex gap-2">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleComment()}
                  placeholder="Escrever comentário..."
                  className="flex-1 bg-card border border-border rounded-xl px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  onClick={handleComment}
                  disabled={!newComment.trim() || commentMutation.isPending}
                  className="p-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Create post form ─────────────────────────────────────────────────────────

function CreatePostForm({ communityId, onCreated }: { readonly communityId: string; readonly onCreated: () => void }) {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(false);

  const createMutation = useMutation({
    mutationFn: () => api.post(`/communities/${communityId}/posts`, { title, content }),
    onSuccess: () => {
      toast({ title: 'Tópico criado!' });
      setTitle('');
      setContent('');
      setOpen(false);
      onCreated();
    },
    onError: (err: any) => toast({ title: err?.response?.data?.message ?? 'Erro ao criar tópico', variant: 'destructive' }),
  });

  if (!user) return null;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
      >
        <UserAvatar name={user.name} avatar={user.avatar} size="sm" />
        <span className="flex-1 text-left">Criar novo tópico...</span>
        <Plus className="w-4 h-4 shrink-0" />
      </button>
    );
  }

  return (
    <div className="bg-card border border-primary/30 rounded-xl p-4 space-y-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título do tópico"
        maxLength={200}
        className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors font-medium"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="O que você quer compartilhar?"
        maxLength={5000}
        rows={4}
        className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setOpen(false)}
          className="px-3 py-1.5 rounded-xl text-xs font-medium bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={() => createMutation.mutate()}
          disabled={!title.trim() || !content.trim() || createMutation.isPending}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {createMutation.isPending ? 'Publicando...' : 'Publicar tópico'}
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CommunityDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: communityData, isLoading } = useQuery({
    queryKey: ['community', slug],
    queryFn: () => api.get(`/communities/${slug}`).then((r) => r.data?.data ?? r.data),
    enabled: !!slug,
  });

  const community: CommunityDetail | null = communityData ?? null;

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['community-posts', community?.id],
    queryFn: () => api.get(`/communities/${community!.id}/posts`).then((r) => r.data?.data ?? r.data),
    enabled: !!community?.id,
  });

  const posts: CommunityPost[] = Array.isArray(postsData) ? postsData : [];

  const joinMutation = useMutation({
    mutationFn: () => api.post(`/communities/${community!.id}/join`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', slug] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      toast({ title: 'Você entrou na comunidade!' });
    },
    onError: () => toast({ title: 'Erro ao entrar', variant: 'destructive' }),
  });

  const leaveMutation = useMutation({
    mutationFn: () => api.post(`/communities/${community!.id}/leave`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', slug] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      toast({ title: 'Você saiu da comunidade.' });
    },
    onError: (err: any) => toast({ title: err?.response?.data?.message ?? 'Erro ao sair', variant: 'destructive' }),
  });

  if (isLoading) return <LoadingSpinner />;
  if (!community) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-muted-foreground">Comunidade não encontrada.</p>
        <Link to="/communities" className="text-primary text-sm mt-2 inline-block hover:underline">
          ← Voltar para comunidades
        </Link>
      </div>
    );
  }

  const isOwner = community.userRole === 'OWNER';
  const isMod = community.userRole === 'MODERATOR';

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Back */}
      <Link to="/communities" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        Todas as comunidades
      </Link>

      {/* Banner */}
      <div className="relative h-32 sm:h-44 bg-gradient-to-r from-primary/30 to-primary/10 rounded-2xl overflow-hidden">
        {community.bannerUrl && (
          <img src={community.bannerUrl} alt="" className="w-full h-full object-cover opacity-50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
        {community.isOfficial && (
          <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
            <Star className="w-3 h-3" />
            Comunidade Oficial
          </span>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 items-start">

        {/* ── LEFT SIDEBAR ──────────────────────────────────────── */}
        <div className="space-y-3 lg:sticky lg:top-4">

          {/* Identity card */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-16 h-16 rounded-xl border-2 border-card bg-secondary shadow-lg overflow-hidden shrink-0">
                {community.avatarUrl ? (
                  <img src={community.avatarUrl} alt={community.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-bold text-2xl">
                    {community.name[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-bold text-foreground text-base leading-tight">{community.name}</h1>
                <div className="flex items-center gap-1.5 mt-1">
                  {community.visibility === 'PUBLIC'
                    ? <Globe className="w-3 h-3 text-muted-foreground" />
                    : <Lock className="w-3 h-3 text-muted-foreground" />}
                  <span className="text-[10px] text-muted-foreground">{community.category || 'Comunidade'}</span>
                </div>
              </div>
            </div>

            {community.description && (
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{community.description}</p>
            )}

            {/* Stats */}
            <div className="flex gap-4 py-2 border-t border-border mb-3">
              <div>
                <p className="text-sm font-bold text-foreground">{community._count?.members ?? 0}</p>
                <p className="text-[10px] text-muted-foreground">membros</p>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{community._count?.posts ?? 0}</p>
                <p className="text-[10px] text-muted-foreground">tópicos</p>
              </div>
            </div>

            {/* Join / Leave */}
            {!isOwner && (
              <button
                onClick={() => community.isMember ? leaveMutation.mutate() : joinMutation.mutate()}
                disabled={joinMutation.isPending || leaveMutation.isPending}
                className={cn(
                  'w-full py-2 rounded-xl text-xs font-semibold transition-all',
                  community.isMember
                    ? 'bg-secondary text-muted-foreground hover:bg-red-500/10 hover:text-red-400 border border-border hover:border-red-500/30'
                    : 'bg-primary text-white hover:bg-primary/90',
                )}
              >
                {community.isMember ? '✓ Participando — sair' : '+ Participar'}
              </button>
            )}
            {isOwner && (
              <div className="w-full py-2 rounded-xl text-xs font-semibold text-center bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                👑 Você é o dono
              </div>
            )}
            {isMod && !isOwner && (
              <div className="w-full py-2 rounded-xl text-xs font-semibold text-center bg-blue-400/10 text-blue-400 border border-blue-400/20 mt-1">
                🛡️ Moderador
              </div>
            )}
          </div>

          {/* Owner */}
          {community.owner && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Dono</h2>
              <Link to={`/profile/${community.owner.id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <UserAvatar name={community.owner.name} avatar={community.owner.avatar} size="sm" />
                <span className="text-xs font-medium text-foreground">{community.owner.name}</span>
              </Link>
            </div>
          )}

          {/* Moderators */}
          {community.moderators.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Moderadores</h2>
              <div className="space-y-2">
                {community.moderators.map((mod) => (
                  <Link key={mod.id} to={`/profile/${mod.id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <UserAvatar name={mod.name} avatar={mod.avatar} size="xs" />
                    <span className="text-xs text-foreground">{mod.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Members */}
          {community.recentMembers.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Membros recentes
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {community.recentMembers.map((m) => (
                  <Link key={m.id} to={`/profile/${m.id}`} title={m.name}>
                    <UserAvatar name={m.name} avatar={m.avatar} size="xs" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── MAIN FEED ──────────────────────────────────────────── */}
        <div className="space-y-3">
          {community.isMember && (
            <CreatePostForm
              communityId={community.id}
              onCreated={() => queryClient.invalidateQueries({ queryKey: ['community-posts', community.id] })}
            />
          )}

          {postsLoading ? (
            <LoadingSpinner />
          ) : posts.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-muted-foreground text-sm">Nenhum tópico ainda.</p>
              {community.isMember && (
                <p className="text-xs text-muted-foreground mt-1">Seja o primeiro a publicar!</p>
              )}
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} communityId={community.id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
