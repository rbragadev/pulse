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
  _count: { likes: number };
}

export interface KudosLike {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
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
