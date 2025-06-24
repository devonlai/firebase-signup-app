'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Icons } from '@/components/icons';
import { Loader2, LogOut, History, PenSquare, BarChart3 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { usePathname } from 'next/navigation';


function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  const menuItems = [
    { href: '/dashboard', label: 'New Entry', icon: PenSquare, },
    { href: '/dashboard/history', label: 'History', icon: History, },
    { href: '/dashboard/visualizations', label: 'Visualize', icon: BarChart3, },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Icons.logo className="w-8 h-8 text-primary" />
          <span className="font-bold text-lg font-headline">DataDiary</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
              >
                <Link href={item.href}>
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}


export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            <main className="p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
