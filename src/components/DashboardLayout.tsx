import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/anyfeast-logo.png';
import {
  LayoutDashboard, Users, Ticket, Award, FileText, BarChart3,
  Settings, LogOut, Dumbbell, UserCheck, CreditCard, ChevronLeft, ChevronRight,
  User, Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const roleNavItems: Record<string, NavItem[]> = {
  super_admin: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Gyms', icon: Dumbbell, path: '/admin/gyms' },
    { label: 'Trainers', icon: UserCheck, path: '/admin/trainers' },
    { label: 'License Pools', icon: CreditCard, path: '/admin/licenses' },
    { label: 'Coupons', icon: Ticket, path: '/admin/coupons' },
    { label: 'Subscriptions', icon: Award, path: '/admin/subscriptions' },
    { label: 'Commissions', icon: BarChart3, path: '/admin/commissions' },
    { label: 'Commission Rules', icon: Award, path: '/admin/commission-rules' },
    { label: 'Nutrition Plans', icon: FileText, path: '/admin/nutrition' },
    { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { label: 'Users', icon: Users, path: '/admin/users' },
  ],
  gym_owner: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/owner' },
    { label: 'Trainers', icon: UserCheck, path: '/owner/trainers' },
    { label: 'License Pools', icon: CreditCard, path: '/owner/licenses' },
    { label: 'Members', icon: Users, path: '/owner/members' },
    { label: 'Commissions', icon: BarChart3, path: '/owner/commissions' },
    { label: 'Nutrition Plans', icon: FileText, path: '/owner/nutrition' },
    { label: 'Analytics', icon: BarChart3, path: '/owner/analytics' },
  ],
  trainer: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/trainer' },
    { label: 'My Members', icon: Users, path: '/trainer/members' },
    { label: 'Coupons', icon: Ticket, path: '/trainer/coupons' },
    { label: 'Commissions', icon: BarChart3, path: '/trainer/commissions' },
    { label: 'Nutrition Plans', icon: FileText, path: '/trainer/nutrition' },
  ],
  member: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/member' },
    { label: 'My Plans', icon: FileText, path: '/member/plans' },
    { label: 'Subscription', icon: Award, path: '/member/subscription' },
  ],
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { primaryRole, signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = primaryRole ? roleNavItems[primaryRole] || [] : [];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 z-40 flex h-screen flex-col bg-primary overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-primary-foreground/20">
          <img src={logo} alt="AnyFeast" className="h-9 w-auto flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-lg font-display font-bold text-primary-foreground truncate"
              >
                AnyFeast
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary-foreground/20 text-primary-foreground shadow-sm'
                    : 'text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/20 p-2 space-y-1">
          <Link
            to="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-all"
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-all"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-50 rounded-full bg-card p-1.5 shadow-elevated border border-border hover:bg-muted transition-colors"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        animate={{ marginLeft: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 min-h-screen"
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-6 py-3">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground capitalize">
              {primaryRole?.replace('_', ' ')} Portal
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors focus:outline-none">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold leading-tight">
                      {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || (user?.phone ? `+${user.phone}` : 'Account')}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize leading-tight">
                      {primaryRole?.replace(/_/g, ' ')}
                    </p>
                  </div>
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="avatar"
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/20"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm ring-2 ring-primary/20">
                      {(user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'U')[0]?.toUpperCase()}
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="pb-1">
                  <p className="font-semibold text-sm truncate">
                    {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || (user?.phone ? `+${user.phone}` : 'Account')}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize font-normal">
                    {primaryRole?.replace(/_/g, ' ')}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer gap-2">
                  <User className="h-4 w-4" /> View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer gap-2">
                  <Settings className="h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2 opacity-60" disabled>
                  <Bell className="h-4 w-4" /> Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
