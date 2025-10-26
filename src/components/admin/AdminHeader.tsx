'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponent } from '@/lib/supabase';
import { User, LogOut, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminHeaderProps {
  user: any;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const supabase = createClientComponent();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  return (
    <header className="bg-background">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your portfolio content</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-accent transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">
                  {user?.email || 'Admin User'}
                </p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-background rounded-xl shadow-lg z-50">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      // Add settings functionality here
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
