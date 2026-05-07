import { useState } from 'react';
import { Heart, MessageSquare, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { KudosPost, KudosComment, ReactionType } from '@/types';
import { formatRelativeTime, cn } from '@/lib/utils';
import api from '@/lib/api';
import UserAvatar from './UserAvatar';

const REACTIONS: { type: ReactionType; emoji: string }[] = [
  { type: 'FIRE',   emoji: '🔥' },
  { type: 'ROCKET', emoji: '🚀' },
  { type: 'HEART',  emoji: '❤️' },
  { type: 'CLAP',   emoji: '👏' },
  { type: 'BRAIN',  emoji: '🧠' },
];

interface KudosCardProps {
  readonly post: KudosPost;
  readonly currentUserId?: string;
  readonly compact?: boolean;
}

export default function KudosCard({ post, currentUserId: _currentUserId, compact = false }: KudosCardProps) {
  const queryClient = useQueryClient();
  const [optimisticLiked, setOptimisticLiked] = useState(post.likedByMe ?? false);
  const [optimisticCount, setOptimisticCount] = useState(post._count.likes);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const likeMutation = useMutation({
    mutationFn: () =>
      optimisticLiked ? api.delete(`/kudos/${post.id}/like`) : api.post(`/kudos/${post.id}/like`),
    onMutate: () => {
      setOptimisticLiked((prev) => !prev);
      setOptimisticCount((prev) => (optimisticLiked ? prev - 1 : prev + 1));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['kudos'] }),
  });

  const { data: reactionsData } = useQuery({
    queryKey: ['reactions', post.id],
    queryFn: () => api.get(`/kudos/${post.id}/reactions`).then((r) => r.data?.data),
    enabled: true,
  });

  const { data: commentsData } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => api.get(`/kudos/${post.id}/comments`).then((r) => r.data?.data),
    enabled: showComments,
  });

  const reactionMutation = useMutation({
    mutationFn: (reactionType: ReactionType) =>
      api.post(`/kudos/${post.id}/react`, { reactionType }).then((r) => r.data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reactions', post.id] });
      setShowReactionPicker(false);
    },
  });

  const commentMutation = useMutation({
    mutationFn: (message: string) =>
      api.post(`/kudos/${post.id}/comments`, { message }).then((r) => r.data),
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries({ queryKey: ['comments', post.id] });
    },
  });

  const reactions = reactionsData?.reactions || [];
  const myReactions: string[] = reactionsData?.myReactions || [];
  const comments: KudosComment[] = commentsData || [];
  const commentCount = comments.length;

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all duration-200 animate-fade-in">
      <div className="flex items-start gap-3">
        <Link to={`/profile/${post.author.id}`}>
          <UserAvatar name={post.author.name} avatar={post.author.avatar} />
        </Link>
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Link to={`/profile/${post.author.id}`} className="font-semibold text-foreground text-sm hover:text-primary transition-colors">
                {post.author.name}
              </Link>
              <span className="text-muted-foreground text-xs">reconheceu</span>
              <Link to={`/profile/${post.recipient.id}`} className="font-semibold text-primary text-sm hover:underline">
                {post.recipient.name}
              </Link>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{formatRelativeTime(post.createdAt)}</span>
          </div>

          {post.author.department && (
            <p className="text-xs text-muted-foreground mt-0.5">{post.author.department.name}</p>
          )}

          {/* Category */}
          <div className="mt-3">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
              style={{
                backgroundColor: post.category.color ? `${post.category.color}20` : 'hsl(var(--secondary))',
                borderColor: post.category.color ? `${post.category.color}40` : 'hsl(var(--border))',
                color: post.category.color || 'hsl(var(--muted-foreground))',
              }}
            >
              {post.category.icon && <span>{post.category.icon}</span>}
              {post.category.name}
            </span>
          </div>

          {/* Message */}
          <p className={cn('mt-3 text-sm text-foreground/90 leading-relaxed', compact && 'line-clamp-2')}>{post.message}</p>

          {/* Reactions display */}
          {reactions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {reactions.map((r: { type: ReactionType; count: number }) => {
                const rConfig = REACTIONS.find((x) => x.type === r.type);
                const isMyReaction = myReactions.includes(r.type);
                return (
                  <button
                    key={r.type}
                    onClick={() => reactionMutation.mutate(r.type)}
                    className={cn(
                      'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all',
                      isMyReaction
                        ? 'bg-primary/15 border-primary/40 text-primary'
                        : 'bg-secondary border-border text-muted-foreground hover:border-primary/30',
                    )}
                  >
                    {rConfig?.emoji} {r.count}
                  </button>
                );
              })}
            </div>
          )}

          {/* Actions bar */}
          <div className="mt-3 flex items-center gap-3 relative">
            {/* Like */}
            <button
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              className={cn(
                'flex items-center gap-1.5 text-xs transition-all',
                optimisticLiked ? 'text-red-400' : 'text-muted-foreground hover:text-red-400',
              )}
            >
              <Heart className={cn('w-3.5 h-3.5', optimisticLiked && 'fill-current')} />
              {optimisticCount > 0 && <span>{optimisticCount}</span>}
            </button>

            {/* Reaction picker toggle */}
            {!compact && (
              <div className="relative">
                <button
                  onClick={() => setShowReactionPicker((p) => !p)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  😊
                </button>
                {showReactionPicker && (
                  <div className="absolute bottom-6 left-0 flex gap-1 bg-card border border-border rounded-xl p-2 shadow-xl z-10">
                    {REACTIONS.map((r) => (
                      <button
                        key={r.type}
                        onClick={() => reactionMutation.mutate(r.type)}
                        className={cn(
                          'text-lg hover:scale-125 transition-transform px-1',
                          myReactions.includes(r.type) && 'opacity-50',
                        )}
                        title={r.type}
                      >
                        {r.emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Comments toggle */}
            {!compact && (
              <button
                onClick={() => setShowComments((p) => !p)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                {commentCount > 0 ? commentCount : ''}
                {showComments ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          {/* Comments section */}
          {showComments && !compact && (
            <div className="mt-4 space-y-3 border-t border-border pt-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2.5">
                  <Link to={`/profile/${comment.author.id}`}>
                    <UserAvatar name={comment.author.name} avatar={comment.author.avatar} size="xs" />
                  </Link>
                  <div className="flex-1 min-w-0 bg-secondary/50 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Link to={`/profile/${comment.author.id}`} className="text-xs font-semibold text-foreground hover:text-primary transition-colors">
                        {comment.author.name}
                      </Link>
                      <span className="text-[10px] text-muted-foreground">{formatRelativeTime(comment.createdAt)}</span>
                    </div>
                    <p className="text-xs text-foreground/90">{comment.message}</p>
                  </div>
                </div>
              ))}

              {/* Add comment */}
              <div className="flex items-center gap-2">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && commentText.trim()) {
                      commentMutation.mutate(commentText.trim());
                    }
                  }}
                  placeholder="Escreva um comentário..."
                  className="flex-1 bg-secondary border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  onClick={() => commentText.trim() && commentMutation.mutate(commentText.trim())}
                  disabled={!commentText.trim() || commentMutation.isPending}
                  className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

