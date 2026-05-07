import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials, cn } from '@/lib/utils';

interface UserAvatarProps {
  name: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
};

export default function UserAvatar({ name, avatar, size = 'md', className }: UserAvatarProps) {
  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={avatar} alt={name} />
      <AvatarFallback className="bg-primary/20 text-primary font-semibold">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
