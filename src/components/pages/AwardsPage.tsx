import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Award {
  id: string;
  name: string;
  image: string;
  recipients: { nickname: string; date: string }[];
}

interface RegisteredUser {
  id: string;
  nickname: string;
  rank: string;
}

const MOCK_AWARDS: Award[] = [
  {
    id: '1',
    name: 'Медаль "За отвагу"',
    image: '🎖️',
    recipients: [
      { nickname: 'Генерал Командир', date: '2025-12-01' },
      { nickname: 'Полковник Петров', date: '2025-12-15' },
    ],
  },
  {
    id: '2',
    name: 'Орден "За службу"',
    image: '🏅',
    recipients: [
      { nickname: 'Подполковник Иванов', date: '2026-01-05' },
    ],
  },
  {
    id: '3',
    name: 'Медаль "За выслугу лет"',
    image: '🥇',
    recipients: [
      { nickname: 'Генерал Командир', date: '2025-11-20' },
    ],
  },
];

const MOCK_USERS: RegisteredUser[] = [
  { id: '1', nickname: 'Генерал Командир', rank: 'Генерал' },
  { id: '2', nickname: 'Полковник Петров', rank: 'Полковник' },
  { id: '3', nickname: 'Подполковник Иванов', rank: 'Подполковник' },
  { id: '4', nickname: 'Капитан Смирнов', rank: 'Капитан' },
  { id: '5', nickname: 'Сержант Сидоров', rank: 'Сержант' },
];

interface AwardsPageProps {
  canEdit?: boolean;
  registeredUsers?: RegisteredUser[];
}

const AwardsPage = ({ canEdit, registeredUsers = MOCK_USERS }: AwardsPageProps) => {
  const [awards, setAwards] = useState<Award[]>(MOCK_AWARDS);
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  const handleAddRecipient = () => {
    if (!selectedAward || !selectedUserId) return;

    const selectedUser = registeredUsers.find(u => u.id === selectedUserId);
    if (!selectedUser) return;

    const newRecipient = {
      nickname: selectedUser.nickname,
      date: new Date().toISOString().split('T')[0],
    };

    const updatedAwards = awards.map(award =>
      award.id === selectedAward.id
        ? { ...award, recipients: [...award.recipients, newRecipient] }
        : award
    );

    setAwards(updatedAwards);
    setSelectedAward({ ...selectedAward, recipients: [...selectedAward.recipients, newRecipient] });
    setSelectedUserId('');
  };

  const handleRemoveRecipient = (recipientNickname: string) => {
    if (!selectedAward) return;

    const updatedRecipients = selectedAward.recipients.filter(r => r.nickname !== recipientNickname);
    const updatedAwards = awards.map(award =>
      award.id === selectedAward.id
        ? { ...award, recipients: updatedRecipients }
        : award
    );

    setAwards(updatedAwards);
    setSelectedAward({ ...selectedAward, recipients: updatedRecipients });
  };

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary tracking-wider">НАГРАДЫ</h1>
        <p className="text-muted-foreground mt-2">Список наград и их обладателей</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {awards.map((award) => (
          <Card
            key={award.id}
            className="military-border bg-card p-6 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => {
              setSelectedAward(award);
              setIsDialogOpen(true);
            }}
          >
            <div className="text-6xl text-center mb-4">{award.image}</div>
            <h3 className="text-center font-bold text-sm">{award.name}</h3>
            <p className="text-center text-xs text-muted-foreground mt-2">
              {award.recipients.length} награждённых
            </p>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="text-4xl">{selectedAward?.image}</span>
              {selectedAward?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Список награждённых:</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {selectedAward?.recipients.map((recipient, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-muted rounded"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon name="User" size={16} className="text-primary" />
                        <span className="font-medium">{recipient.nickname}</span>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">
                        Награждён: {new Date(recipient.date).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRecipient(recipient.nickname)}
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {canEdit && (
              <div className="pt-4 border-t border-border">
                <label className="text-sm font-medium">Наградить пользователя</label>
                <div className="flex gap-2 mt-2">
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Выберите пользователя" />
                    </SelectTrigger>
                    <SelectContent>
                      {registeredUsers
                        .filter(user => !selectedAward?.recipients.some(r => r.nickname === user.nickname))
                        .map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.nickname} ({user.rank})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddRecipient} disabled={!selectedUserId}>
                    <Icon name="Plus" size={18} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AwardsPage;