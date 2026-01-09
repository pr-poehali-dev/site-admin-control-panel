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

interface Division {
  id: string;
  title: string;
  description: string;
  icon: string;
  link?: string;
}

const MOCK_DIVISIONS: Division[] = [
  {
    id: '1',
    title: 'Разведывательный отряд',
    description: 'Специализируется на сборе разведывательной информации и проведении тайных операций.',
    icon: 'Search',
    link: '#',
  },
  {
    id: '2',
    title: 'Штурмовая группа',
    description: 'Основная боевая единица, специализирующаяся на прямых атаках и захвате территорий.',
    icon: 'Zap',
    link: '#',
  },
  {
    id: '3',
    title: 'Инженерный корпус',
    description: 'Отвечает за строительство укреплений, разминирование и техническую поддержку.',
    icon: 'Wrench',
    link: '#',
  },
];

interface DivisionsPageProps {
  isAdmin?: boolean;
}

const DivisionsPage = ({ isAdmin }: DivisionsPageProps) => {
  const [divisions, setDivisions] = useState<Division[]>(MOCK_DIVISIONS);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);

  const handleSave = () => {
    if (!editingDivision) return;

    if (editingDivision.id === 'new') {
      setDivisions([...divisions, { ...editingDivision, id: Date.now().toString() }]);
    } else {
      setDivisions(divisions.map(div => div.id === editingDivision.id ? editingDivision : div));
    }

    setEditingDivision(null);
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    setDivisions(divisions.filter(div => div.id !== id));
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary tracking-wider">ПОДРАЗДЕЛЕНИЯ</h1>
        {isAdmin && (
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button
                className="gap-2"
                onClick={() => setEditingDivision({ id: 'new', title: '', description: '', icon: 'Users' })}
              >
                <Icon name="Plus" size={18} />
                Добавить подразделение
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Редактировать подразделение</DialogTitle>
              </DialogHeader>
              {editingDivision && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Название</label>
                    <Input
                      value={editingDivision.title}
                      onChange={(e) => setEditingDivision({ ...editingDivision, title: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Описание</label>
                    <Textarea
                      value={editingDivision.description}
                      onChange={(e) => setEditingDivision({ ...editingDivision, description: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Иконка</label>
                    <Input
                      value={editingDivision.icon}
                      onChange={(e) => setEditingDivision({ ...editingDivision, icon: e.target.value })}
                      className="mt-1"
                      placeholder="Search, Zap, Shield..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Ссылка</label>
                    <Input
                      value={editingDivision.link || ''}
                      onChange={(e) => setEditingDivision({ ...editingDivision, link: e.target.value })}
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
        {divisions.map((division) => (
          <AccordionItem key={division.id} value={division.id} className="border-none">
            <Card className="military-border bg-card">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-4 w-full">
                  <div className="w-12 h-12 rounded bg-primary/20 flex items-center justify-center">
                    <Icon name={division.icon} size={24} className="text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-lg font-bold">{division.title}</h3>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingDivision(division);
                          setIsEditing(true);
                        }}
                      >
                        <Icon name="Edit" size={14} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(division.id)}
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-muted-foreground mb-4">{division.description}</p>
                {division.link && (
                  <a
                    href={division.link}
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

export default DivisionsPage;
