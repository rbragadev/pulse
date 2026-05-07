import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { KudosPost } from '@/types';
import { formatRelativeTime, cn } from '@/lib/utils';
import api from '@/lib/api';
import UserAvatar from './UserAvatar';

interface KudosCardProps {
  readonly post: KudosPost;
  readonly currentUserId?: string;
}

export default function KudosCard({ post, currentUserId: _currentUserId }: KudosCardProps) {
  const queryClient = useQueryClient();
  const [optimisticLiked, setOptimisticLiked] = useState(post.likedByMe ?? false);
  const [optimisticCount, setOptimisticCount] = useState(post._count.likes);

  const likeMutation = useMutation({
    mutationFn: () =>
      optimisticLiked
        ? api.delete(`/kudos/${post.id}/like`)
        : api.post(`/kudos/${post.id}/like`),
    onMutate: () => {
      setOptimisticLiked((prev) => !prev);
      setOptimisticCount((prev) => (optimisticLiked ? prev - 1 : prev + 1));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['kudos'] });
    },
  });

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all duration-200 animate-fade-in">
      <div className="flex items-start gap-3">
        <UserAvatar name={post.author.name} avatar={post.author.avatar} />
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground text-sm">{post.author.name}</span>
              <span className="text-muted-foreground text-xs">reconheceu</span>
              <span className="font-semibold text-primary text-sm">{post.recipient.name}</span>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">
              {formatRelativeTime(post.createdAt)}
            </span>
          </div>

          {/* Author department */}
          {post.author.department && (
            <p className="text-xs text-muted-foreground mt-0.5">{post.author.department.name}</p>
          )}

          {/* Category badge */}
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
          <p className="mt-3 text-sm text-foreground/90 leading-relaxed">{post.message}</p>

          {/* Actions */}
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              className={cn(
                'flex items-center gap-1.5 text-xs transition-all',
                optimisticLiked
                  ? 'text-red-400'
                  : 'text-muted-foreground hover:text-red-400',
              )}
            >
              <Heart className={cn('w-3.5 h-3.5', optimisticLiked && 'fill-current')} />
              {optimisticCount > 0 && <span>{optimisticCount}</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
