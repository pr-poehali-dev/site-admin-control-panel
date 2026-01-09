import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Award {
  id: string;
  name: string;
  image: string;
  recipients: string[];
}

const MOCK_AWARDS: Award[] = [
  {
    id: '1',
    name: 'Медаль "За отвагу"',
    image: '🎖️',
    recipients: ['Генерал Командир', 'Полковник Петров', 'Майор Сидоров'],
  },
  {
    id: '2',
    name: 'Орден "За службу"',
    image: '🏅',
    recipients: ['Подполковник Иванов', 'Капитан Смирнов'],
  },
  {
    id: '3',
    name: 'Медаль "За выслугу лет"',
    image: '🥇',
    recipients: ['Генерал Командир', 'Полковник Петров'],
  },
];

interface AwardsPageProps {
  canEdit?: boolean;
}

const AwardsPage = ({ canEdit }: AwardsPageProps) => {
  const [awards, setAwards] = useState<Award[]>(MOCK_AWARDS);
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRecipient, setNewRecipient] = useState('');

  const handleAddRecipient = () => {
    if (!selectedAward || !newRecipient.trim()) return;

    const updatedAwards = awards.map(award =>
      award.id === selectedAward.id
        ? { ...award, recipients: [...award.recipients, newRecipient.trim()] }
        : award
    );

    setAwards(updatedAwards);
    setSelectedAward({ ...selectedAward, recipients: [...selectedAward.recipients, newRecipient.trim()] });
    setNewRecipient('');
  };

  const handleRemoveRecipient = (recipientName: string) => {
    if (!selectedAward) return;

    const updatedRecipients = selectedAward.recipients.filter(r => r !== recipientName);
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
                    <div className="flex items-center gap-2">
                      <Icon name="User" size={16} className="text-primary" />
                      <span>{recipient}</span>
                    </div>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRecipient(recipient)}
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
                <label className="text-sm font-medium">Добавить награждённого</label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    placeholder="Введите ФИО"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddRecipient()}
                  />
                  <Button onClick={handleAddRecipient}>
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
