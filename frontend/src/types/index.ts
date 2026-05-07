export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  departmentId?: string;
  department?: Department;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KudosCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  weight: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { posts: number };
  rule?: PointRule | null;
}

export type KudosPostStatus = 'ACTIVE' | 'HIDDEN' | 'REMOVED';

export interface KudosPost {
  id: string;
  message: string;
  authorId: string;
  recipientId: string;
  categoryId: string;
  status: KudosPostStatus;
  createdAt: string;
  updatedAt: string;
  author: User;
  recipient: User;
  category: KudosCategory;
  likedByMe: boolean;
  _count: { likes: number; comments?: number };
  reactions?: ReactionSummary[];
  myReactions?: string[];
}

export interface KudosLike {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface KudosComment {
  id: string;
  postId: string;
  authorId: string;
  message: string;
  createdAt: string;
  author: Pick<User, 'id' | 'name' | 'avatar'> & { department?: Department | null };
}

export type ReactionType = 'FIRE' | 'ROCKET' | 'HEART' | 'CLAP' | 'BRAIN';

export interface ReactionSummary {
  type: ReactionType;
  count: number;
}

export type BadgeRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface Badge {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  rarity: BadgeRarity;
  createdAt: string;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  unlockedAt: string;
  badge: Badge;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: string;
  conditionValue: number;
  icon?: string;
  createdAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  progress: number;
  completed: boolean;
  completedAt?: string;
  achievement: Achievement;
}

export type VoteType = 'TRUSTWORTHY' | 'COOL' | 'PROFESSIONAL';

export interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt: string;
  rankings?: SeasonRanking[];
}

export interface SeasonRanking {
  id: string;
  seasonId: string;
  userId: string;
  position: number;
  points: number;
  user: User & { department?: Department | null };
}

export interface SocialProfile {
  user: User & { department?: Department | null };
  stats: { kudosReceived: number; kudosSent: number };
  badges: UserBadge[];
  achievements: UserAchievement[];
  votes: Record<VoteType, number>;
  myVotes: Record<VoteType, boolean>;
  recentVisitors: Array<Pick<User, 'id' | 'name' | 'avatar'> & { visitedAt: string }>;
  topCategories: Array<{ category: KudosCategory | null; count: number }>;
  fans: Array<{ user: Pick<User, 'id' | 'name' | 'avatar'> | null; count: number }>;
}

export interface PointRule {
  id: string;
  categoryId: string;
  points: number;
  weeklyLimit: number;
  cooldownHours: number;
  createdAt: string;
  updatedAt: string;
  category?: KudosCategory;
}

export interface PaginatedResponse<T> {
  data: {
    [key: string]: unknown;
    total: number;
    page: number;
    limit: number;
    items?: T[];
  };
  timestamp: string;
}

export interface RankingItem {
  position: number;
  userId: string;
  name: string;
  avatarUrl: string | null;
  department: string | null;
  kudosReceived: number;
  user: User;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalKudos: number;
  kudosThisMonth: number;
  topCategories: Array<{ category: KudosCategory; count: number }>;
  topUsers: Array<{ user: User; kudosCount: number }>;
}

