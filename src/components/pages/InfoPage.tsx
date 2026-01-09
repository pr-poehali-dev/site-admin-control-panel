import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface InfoItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  link?: string;
}

const MOCK_INFO: InfoItem[] = [
  {
    id: '1',
    title: 'Система званий',
    description: 'Полная информация о воинских званиях, требованиях к повышению и сроках службы.',
    icon: 'Star',
    link: '#',
  },
  {
    id: '2',
    title: 'Правила поведения',
    description: 'Основные правила поведения на сервере и взаимодействия с другими участниками.',
    icon: 'Shield',
    link: '#',
  },
  {
    id: '3',
    title: 'Контакты командования',
    description: 'Список контактов для связи с командованием и решения организационных вопросов.',
    icon: 'Phone',
    link: '#',
  },
];

interface InfoPageProps {
  isAdmin?: boolean;
}

const InfoPage = ({ isAdmin }: InfoPageProps) => {
  const [items, setItems] = useState<InfoItem[]>(MOCK_INFO);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<InfoItem | null>(null);

  const handleSave = () => {
    if (!editingItem) return;

    if (editingItem.id === 'new') {
      setItems([...items, { ...editingItem, id: Date.now().toString() }]);
    } else {
      setItems(items.map(item => item.id === editingItem.id ? editingItem : item));
    }

    setEditingItem(null);
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary tracking-wider">ИНФОРМАЦИЯ</h1>
        {isAdmin && (
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button
                className="gap-2"
                onClick={() => setEditingItem({ id: 'new', title: '', description: '', icon: 'FileText' })}
              >
                <Icon name="Plus" size={18} />
                Добавить раздел
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Редактировать раздел</DialogTitle>
              </DialogHeader>
              {editingItem && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Название</label>
                    <Input
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Описание</label>
                    <Textarea
                      value={editingItem.description}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Иконка (lucide-react)</label>
                    <Input
                      value={editingItem.icon}
                      onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                      className="mt-1"
                      placeholder="Star, Shield, Phone..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Ссылка (опционально)</label>
                    <Input
                      value={editingItem.link || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, link: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleSave} className="w-full">
                    Сохранить
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id} className="border-none">
            <Card className="military-border bg-card">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-4 w-full">
                  <div className="w-12 h-12 rounded bg-primary/20 flex items-center justify-center">
                    <Icon name={item.icon} size={24} className="text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingItem(item);
                          setIsEditing(true);
                        }}
                      >
                        <Icon name="Edit" size={14} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-muted-foreground mb-4">{item.description}</p>
                {item.link && (
                  <a
                    href={item.link}
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Подробнее
                    <Icon name="ExternalLink" size={14} />
                  </a>
                )}
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default InfoPage;
