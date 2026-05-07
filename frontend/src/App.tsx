import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import LoginPage from '@/pages/LoginPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import AppLayout from '@/components/layout/AppLayout';
import FeedPage from '@/pages/FeedPage';
import GalacticosPage from '@/pages/GalacticosPage';
import ProfilePage from '@/pages/ProfilePage';
import HallOfFamePage from '@/pages/HallOfFamePage';
import BadgesPage from '@/pages/BadgesPage';
import CommunitiesPage from '@/pages/CommunitiesPage';
import CommunityDetailPage from '@/pages/CommunityDetailPage';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminKudos from '@/pages/admin/AdminKudos';
import AdminRules from '@/pages/admin/AdminRules';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminCommunities from '@/pages/admin/AdminCommunities';

function PrivateRoute({ children }: { readonly children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { readonly children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/feed" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/feed" replace />} />
        <Route path="feed" element={<FeedPage />} />
        <Route path="galacticos" element={<GalacticosPage />} />
        <Route path="profile/:id" element={<ProfilePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="hall-of-fame" element={<HallOfFamePage />} />
        <Route path="badges" element={<BadgesPage />} />
        <Route path="communities" element={<CommunitiesPage />} />
        <Route path="communities/:slug" element={<CommunityDetailPage />} />
      </Route>
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="posts" element={<Navigate to="/admin/kudos" replace />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="kudos" element={<AdminKudos />} />
        <Route path="rules" element={<AdminRules />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="communities" element={<AdminCommunities />} />
      </Route>
      <Route path="*" element={<Navigate to="/feed" replace />} />
    </Routes>
  );
}
