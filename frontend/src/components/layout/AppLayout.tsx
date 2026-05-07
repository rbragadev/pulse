import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Toaster } from '@/components/ui/Toaster';

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  );
}
