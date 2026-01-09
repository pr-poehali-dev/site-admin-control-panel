import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

type UserRole = 'user' | 'moderator' | 'admin';

interface User {
  id: string;
  code: string;
  nickname: string;
  rank: string;
  rankDate: Date;
  position: string;
  positionDate: Date;
  role: UserRole;
  needsPromotion?: boolean;
}

const RANKS = [
  'Рядовой',
  'Ефрейтор',
  'Младший сержант',
  'Сержант',
  'Старший сержант',
  'Старшина',
  'Прапорщик',
  'Младший лейтенант',
  'Лейтенант',
  'Старший лейтенант',
  'Капитан',
  'Майор',
  'Подполковник',
  'Полковник',
  'Генерал',
];

const MOCK_USERS: User[] = [
  {
    id: '1',
    code: 'ADMIN001',
    nickname: 'Командир',
    rank: 'Генерал',
    rankDate: new Date('2025-01-01'),
    position: 'Командующий',
    positionDate: new Date('2025-01-01'),
    role: 'admin',
  },
  {
    id: '2',
    code: 'MOD001',
    nickname: 'Сержант Петров',
    rank: 'Старший сержант',
    rankDate: new Date('2025-12-20'),
    position: 'Инструктор',
    positionDate: new Date('2025-12-25'),
    role: 'moderator',
    needsPromotion: true,
  },
  {
    id: '3',
    code: 'USER001',
    nickname: 'Рядовой Иванов',
    rank: 'Рядовой',
    rankDate: new Date('2026-01-07'),
    position: 'Боец',
    positionDate: new Date('2026-01-07'),
    role: 'user',
  },
];

interface UsersPageProps {
  isAdmin?: boolean;
}

const UsersPage = ({ isAdmin }: UsersPageProps) => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const filteredUsers = users.filter(user =>
    user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveUser = () => {
    if (!selectedUser) return;

    if (selectedUser.id === 'new') {
      const newUser = {
        ...selectedUser,
        id: Date.now().toString(),
        code: `USER${Date.now()}`,
      };
      setUsers([...users, newUser]);
    } else {
      setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
    }

    setSelectedUser(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  const checkPromotionDate = (user: User): boolean => {
    const daysSincePromotion = Math.floor((Date.now() - user.rankDate.getTime()) / (1000 * 60 * 60 * 24));
    const rankIndex = RANKS.indexOf(user.rank);

    if (rankIndex <= 1) return daysSincePromotion >= 2;
    if (rankIndex <= 3) return daysSincePromotion >= 3;
    if (rankIndex <= 6) return daysSincePromotion >= 7;
    if (rankIndex <= 9) return daysSincePromotion >= 10;

    return false;
  };

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary tracking-wider mb-4">УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ</h1>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск по имени или званию"
              className="pl-10"
            />
          </div>
          {isAdmin && (
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button
                  className="gap-2"
                  onClick={() => {
                    setSelectedUser({
                      id: 'new',
                      code: '',
                      nickname: '',
                      rank: 'Рядовой',
                      rankDate: new Date(),
                      position: '',
                      positionDate: new Date(),
                      role: 'user',
                    });
                  }}
                >
                  <Icon name="UserPlus" size={18} />
                  Регистрация нового пользователя
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Регистрация нового пользователя</DialogTitle>
                </DialogHeader>
                {selectedUser && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Игровой ник</label>
                      <Input
                        value={selectedUser.nickname}
                        onChange={(e) => setSelectedUser({ ...selectedUser, nickname: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Ранг/Звание</label>
                      <Select
                        value={selectedUser.rank}
                        onValueChange={(value) => setSelectedUser({ ...selectedUser, rank: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RANKS.map(rank => (
                            <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Дата последнего повышения</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start mt-1">
                            <Icon name="Calendar" size={16} className="mr-2" />
                            {format(selectedUser.rankDate, 'PPP', { locale: ru })}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedUser.rankDate}
                            onSelect={(date) => date && setSelectedUser({ ...selectedUser, rankDate: date })}
                            locale={ru}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Должность</label>
                      <Input
                        value={selectedUser.position}
                        onChange={(e) => setSelectedUser({ ...selectedUser, position: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">С какого числа в должности</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start mt-1">
                            <Icon name="Calendar" size={16} className="mr-2" />
                            {format(selectedUser.positionDate, 'PPP', { locale: ru })}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedUser.positionDate}
                            onSelect={(date) => date && setSelectedUser({ ...selectedUser, positionDate: date })}
                            locale={ru}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Права на сервере</label>
                      <Select
                        value={selectedUser.role}
                        onValueChange={(value: UserRole) => setSelectedUser({ ...selectedUser, role: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Пользователь</SelectItem>
                          <SelectItem value="moderator">Модератор</SelectItem>
                          <SelectItem value="admin">Администратор</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSaveUser} className="w-full">
                      Создать пользователя
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card
            key={user.id}
            className="military-border bg-card p-6 cursor-pointer hover:bg-muted/50 transition-colors relative"
            onClick={() => {
              setSelectedUser(user);
              setIsEditing(true);
            }}
          >
            {checkPromotionDate(user) && (
              <div className="absolute top-4 right-4 w-4 h-4 bg-destructive rounded-full animate-pulse" />
            )}
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon name="User" size={32} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{user.nickname}</h3>
                <div className="flex gap-6 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icon name="Award" size={14} />
                    {user.rank}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Briefcase" size={14} />
                    {user.position}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Shield" size={14} />
                    {user.role.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="bg-card max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактирование пользователя</DialogTitle>
          </DialogHeader>
          {selectedUser && selectedUser.id !== 'new' && (
            <div className="space-y-4">
              {checkPromotionDate(selectedUser) && (
                <div className="p-4 bg-destructive/10 border border-destructive rounded flex items-center gap-2">
                  <Icon name="AlertCircle" size={20} className="text-destructive" />
                  <p className="text-sm text-destructive font-medium">Настал день повышения!</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Код доступа</label>
                <Input value={selectedUser.code} disabled className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Игровой ник</label>
                <Input value={selectedUser.nickname} disabled className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Ранг/Звание</label>
                <Select
                  value={selectedUser.rank}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, rank: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RANKS.map(rank => (
                      <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Дата последнего повышения</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start mt-1">
                      <Icon name="Calendar" size={16} className="mr-2" />
                      {format(selectedUser.rankDate, 'PPP', { locale: ru })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedUser.rankDate}
                      onSelect={(date) => date && setSelectedUser({ ...selectedUser, rankDate: date })}
                      locale={ru}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-sm font-medium">Должность</label>
                <Input
                  value={selectedUser.position}
                  onChange={(e) => setSelectedUser({ ...selectedUser, position: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">С какого числа в должности</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start mt-1">
                      <Icon name="Calendar" size={16} className="mr-2" />
                      {format(selectedUser.positionDate, 'PPP', { locale: ru })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedUser.positionDate}
                      onSelect={(date) => date && setSelectedUser({ ...selectedUser, positionDate: date })}
                      locale={ru}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-sm font-medium">Права на сервере</label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value: UserRole) => setSelectedUser({ ...selectedUser, role: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Пользователь</SelectItem>
                    <SelectItem value="moderator">Модератор</SelectItem>
                    <SelectItem value="admin">Администратор</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSaveUser} className="w-full">
                Сохранить изменения
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
