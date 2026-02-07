// ... imports including UserX
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
  Milk,
  FileText,
  CreditCard,
  Menu,
  User,
  UserX,
  Shield,
  Trash2,
  LogOut
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '@/app/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";

export function DashboardSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const { logout } = useAuth();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const isCollapsed = state === 'collapsed';
  const onToggle = toggleSidebar;

  const handleLogout = () => {
    logout();
    setLogoutConfirmOpen(false);
  };

  const menuItems: { id: string; label: string; icon: any; disabled?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'deactivate-user', label: 'Deactivate User', icon: UserX },
    { id: 'privacy-policy', label: 'Privacy & Policy', icon: Shield },
    { id: 'inventory', label: 'Inventory', icon: Milk, disabled: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, disabled: true },
    { id: 'reports', label: 'Reports', icon: FileText, disabled: true },
    { id: 'settings', label: 'Settings', icon: Settings, disabled: true },
  ];

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ease-in-out z-40 ${isCollapsed ? 'w-20' : 'w-72'
          }`}
      >
        {/* Header */}
        <div className={`px-4 py-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="size-9 bg-sidebar-primary rounded-xl flex items-center justify-center shadow-lg shadow-sidebar-primary/20">
                <span className="font-black text-xl italic">T</span>
              </div>
              <div>
                <h1 className="text-lg font-bold leading-none tracking-tight">True Harvest</h1>
                <p className="text-[10px] uppercase font-bold text-sidebar-foreground/50 tracking-widest mt-1">Admin Panel</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="size-10 rounded-xl hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/70 transition-all active:scale-95"
          >
            <Menu className={`size-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto custom-scrollbar pb-6 focus:outline-none">
          {menuItems.map((item) => {
            const Icon = item.icon;

            if (item.disabled) {
              return (
                <button
                  key={item.id}
                  disabled
                  className={`w-full group relative flex items-center rounded-xl transition-all duration-300 ease-out h-11 ${isCollapsed ? 'justify-center' : 'px-3 gap-3'} text-sidebar-foreground/40 cursor-not-allowed`}
                >
                  <Icon className="size-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="text-sm font-semibold whitespace-nowrap overflow-hidden opacity-80">
                      {item.label}
                    </span>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-16 px-2 py-1.5 bg-sidebar-accent border border-sidebar-border text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-xl">
                      {item.label} (Disabled)
                    </div>
                  )}
                </button>
              )
            }

            return (
              <NavLink
                key={item.id}
                to={`/${item.id}`}
                className={({ isActive }) => `w-full group relative flex items-center rounded-xl transition-all duration-300 ease-out h-11 ${isCollapsed ? 'justify-center' : 'px-3 gap-3'
                  } ${isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20'
                    : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`size-5 flex-shrink-0 transition-transform ${isActive ? '' : 'group-hover:scale-110'}`} />

                    {!isCollapsed && (
                      <span className={`text-sm font-semibold transition-opacity duration-300 whitespace-nowrap overflow-hidden ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'
                        }`}>
                        {item.label}
                      </span>
                    )}

                    {isCollapsed && isActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary-foreground rounded-l-full" />
                    )}

                    {isCollapsed && (
                      <div className="absolute left-16 px-2 py-1.5 bg-sidebar-accent border border-sidebar-border text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-xl">
                        {item.label}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Profile Footer */}
        <div
          className={`p-4 border-t border-sidebar-border/50 mt-auto bg-sidebar-accent/10 transition-all duration-300 ${isCollapsed ? 'flex justify-center cursor-pointer hover:bg-destructive/10 group/logout' : ''}`}
          onClick={isCollapsed ? onLogout : undefined}
        >
          <div className={`flex items-center gap-3 ${isCollapsed ? 'w-auto' : 'w-full'}`}>
            <div className="size-10 rounded-xl overflow-hidden border border-sidebar-border bg-sidebar-primary/20 flex items-center justify-center flex-shrink-0">
              <User className="size-6 text-sidebar-foreground/70" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">Admin User</p>
                <p className="text-[10px] text-sidebar-foreground/40 font-bold uppercase tracking-widest truncate">Super Admin</p>
              </div>
            )}

          </div>

          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "default"}
            onClick={() => setLogoutConfirmOpen(true)}
            className={`text-red-500 hover:text-red-700 hover:bg-red-50 ${isCollapsed ? '' : 'px-3'}`}
            title="Logout"
          >
            <LogOut className="size-5" />
            {!isCollapsed && <span className="ml-2 font-medium">Logout</span>}
          </Button>
        </div>
      </aside>

      <AlertDialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be redirected to the login page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div
        className={`relative hidden md:block h-screen bg-transparent transition-all duration-300 ease-in-out flex-shrink-0 ${isCollapsed ? 'w-20' : 'w-72'
          }`}
      />
    </>
  );
}
