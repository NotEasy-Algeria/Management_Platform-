import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Baby,
  CreditCard,
  MessageCircle,
  Menu,
  LogOut,
  Settings,
  Bell,
  Home
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ParentLayoutProps {
  children: React.ReactNode;
}

const ParentLayout = ({ children }: ParentLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigationItems = [
    {
      name: 'Tableau de bord',
      href: '/parent',
      icon: LayoutDashboard,
      current: location.pathname === '/parent'
    },
    {
      name: 'Mon enfant',
      href: '/parent/child',
      icon: Baby,
      current: location.pathname === '/parent/child'
    },
    {
      name: 'Paiements',
      href: '/parent/payments',
      icon: CreditCard,
      current: location.pathname === '/parent/payments'
    },
    {
      name: 'Messages',
      href: '/parent/remarks',
      icon: MessageCircle,
      current: location.pathname === '/parent/remarks'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b">
        <Baby className="h-8 w-8 text-pink-500" />
        <span className="ml-2 text-xl font-bold text-gray-800">Ma Crèche</span>
        <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">
          Parent
        </Badge>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              item.current
                ? 'bg-pink-100 text-pink-700 border-r-2 border-pink-500'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* User Menu */}
      <div className="border-t px-4 py-4">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'P'}
            </span>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{user?.name}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
              </Sheet>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-lg font-semibold text-gray-900">
                  Espace Parent
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                <Home className="w-4 h-4 mr-1 inline" />
                Retour au site
              </Link>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ParentLayout;