'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  Wrench, 
  FolderOpen, 
  MessageSquare, 
  BarChart3,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'Tools', href: '/admin/tools', icon: Wrench },
  { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { name: 'Leads', href: '/admin/leads', icon: MessageSquare },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-background min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">Portfolio Management</p>
          </div>
        </div>

        <nav className="space-y-2">
          <Link
            href="/"
            className="flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>View Site</span>
          </Link>

          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 text-sm rounded-xl transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
