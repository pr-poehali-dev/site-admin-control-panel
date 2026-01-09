import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import NewsPage from '@/components/pages/NewsPage';
import InfoPage from '@/components/pages/InfoPage';
import DivisionsPage from '@/components/pages/DivisionsPage';
import AwardsPage from '@/components/pages/AwardsPage';
import CharterPage from '@/components/pages/CharterPage';
import UsersPage from '@/components/pages/UsersPage';

type UserRole = 'guest' | 'user' | 'moderator' | 'admin';

interface User {
  code: string;
  nickname: string;
  rank: string;
  role: UserRole;
  photo?: string;
}

const MOCK_USERS: User[] = [
  { code: 'ADMIN001', nickname: 'Командир', rank: 'Генерал', role: 'admin' },
  { code: 'MOD001', nickname: 'Сержант Петров', rank: 'Старший сержант', role: 'moderator' },
  { code: 'USER001', nickname: 'Рядовой Иванов', rank: 'Рядовой', role: 'user' },
];

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuRotated, setIsMenuRotated] = useState(false);
  const [currentPage, setCurrentPage] = useState('news');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginCode, setLoginCode] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleMenuToggle = (open: boolean) => {
    setIsMenuOpen(open);
    setIsMenuRotated(open);
  };

  const handleLogin = () => {
    const user = MOCK_USERS.find(u => u.code === loginCode);
    if (user) {
      setCurrentUser(user);
      setIsLoginOpen(false);
      setLoginCode('');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('news');
  };

  const canEdit = currentUser && (currentUser.role === 'admin' || currentUser.role === 'moderator');
  const isAdmin = currentUser?.role === 'admin';

  const menuItems = [
    { id: 'news', label: 'Новости', icon: 'Newspaper', roles: ['guest', 'user', 'moderator', 'admin'] },
    { id: 'info', label: 'Информация', icon: 'Info', roles: ['guest', 'user', 'moderator', 'admin'] },
    { id: 'divisions', label: 'Подразделения', icon: 'Users', roles: ['guest', 'user', 'moderator', 'admin'] },
    { id: 'awards', label: 'Награды', icon: 'Award', roles: ['guest', 'user', 'moderator', 'admin'] },
    { id: 'charter', label: 'Устав', icon: 'FileText', roles: ['guest', 'user', 'moderator', 'admin'] },
    { id: 'users', label: 'Пользователи', icon: 'UserCog', roles: ['moderator', 'admin'] },
  ];

  const userRole: UserRole = currentUser?.role || 'guest';
  const visibleMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  const renderPage = () => {
    switch (currentPage) {
      case 'news':
        return <NewsPage canEdit={canEdit} currentUser={currentUser} />;
      case 'info':
        return <InfoPage isAdmin={isAdmin} />;
      case 'divisions':
        return <DivisionsPage isAdmin={isAdmin} />;
      case 'awards':
        return <AwardsPage canEdit={canEdit} />;
      case 'charter':
        return <CharterPage isAdmin={isAdmin} />;
      case 'users':
        return <UsersPage isAdmin={isAdmin} />;
      default:
        return <NewsPage canEdit={canEdit} currentUser={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b-2 border-primary z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Sheet open={isMenuOpen} onOpenChange={handleMenuToggle}>
            <SheetTrigger asChild>
              <button
                className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-all rounded"
                aria-label="Меню"
              >
                <Icon
                  name="Menu"
                  className={`transition-transform duration-300 ${isMenuRotated ? 'rotate-180 text-primary' : 'text-foreground'}`}
                  size={28}
                />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar border-r-2 border-primary p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-sidebar-border">
                  <h2 className="text-2xl font-bold text-primary tracking-wider">ВОЕННЫЙ ПОРТАЛ</h2>
                  {currentUser && (
                    <div className="mt-4 pt-4 border-t border-sidebar-border">
                      <p className="text-sm text-muted-foreground">Звание</p>
                      <p className="font-semibold text-foreground">{currentUser.rank}</p>
                      <p className="text-sm text-muted-foreground mt-2">Никнейм</p>
                      <p className="font-semibold text-foreground">{currentUser.nickname}</p>
                      <p className="text-xs text-primary mt-2">{currentUser.role.toUpperCase()}</p>
                    </div>
                  )}
                </div>
                <nav className="flex-1 p-4">
                  {visibleMenuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentPage(item.id);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded transition-all ${
                        currentPage === item.id
                          ? 'bg-primary text-primary-foreground font-bold'
                          : 'hover:bg-sidebar-accent text-sidebar-foreground'
                      }`}
                    >
                      <Icon name={item.icon} size={20} />
                      <span className="text-sm uppercase tracking-wide">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold tracking-wider text-primary hidden sm:block">ВОЕННЫЙ ПОРТАЛ</h1>
        </div>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Icon name="User" size={20} />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card">
                <DialogHeader>
                  <DialogTitle>Профиль</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                      <Icon name="User" size={48} className="text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Никнейм</p>
                    <p className="font-semibold">{currentUser.nickname}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Звание</p>
                    <p className="font-semibold">{currentUser.rank}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Роль</p>
                    <p className="font-semibold text-primary">{currentUser.role.toUpperCase()}</p>
                  </div>
                  <Button onClick={handleLogout} variant="destructive" className="w-full">
                    Выйти
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="rounded-full gap-2">
                  <Icon name="LogIn" size={18} />
                  <span className="hidden sm:inline">Войти</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card">
                <DialogHeader>
                  <DialogTitle>Вход в систему</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Код доступа</label>
                    <Input
                      type="text"
                      placeholder="Введите код"
                      value={loginCode}
                      onChange={(e) => setLoginCode(e.target.value)}
                      className="mt-1"
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                  </div>
                  <Button onClick={handleLogin} className="w-full">
                    Войти
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Тестовые коды: ADMIN001, MOD001, USER001
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </header>

      <main className="pt-16 min-h-screen">
        {renderPage()}
      </main>
    </div>
  );
};

export default Index;
