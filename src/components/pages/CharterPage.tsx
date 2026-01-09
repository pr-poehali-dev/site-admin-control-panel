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

interface CharterSection {
  id: string;
  title: string;
  content: string;
}

const MOCK_CHARTER: CharterSection[] = [
  {
    id: '1',
    title: 'Глава 1. Общие положения',
    content: 'Настоящий устав регулирует порядок службы, права и обязанности военнослужащих. Все участники обязаны соблюдать положения устава и следовать приказам командования.',
  },
  {
    id: '2',
    title: 'Глава 2. Воинские звания',
    content: 'Установлены следующие воинские звания: Рядовой, Ефрейтор, Младший сержант, Сержант, Старший сержант, Старшина, Прапорщик, Младший лейтенант, Лейтенант, Старший лейтенант, Капитан, Майор, Подполковник, Полковник, Генерал. Повышение производится согласно графику и требованиям.',
  },
  {
    id: '3',
    title: 'Глава 3. Дисциплина',
    content: 'Воинская дисциплина является обязательным условием службы. Нарушение дисциплины влечёт применение дисциплинарных взысканий: замечание, выговор, понижение в звании, исключение из состава.',
  },
  {
    id: '4',
    title: 'Глава 4. Порядок повышения',
    content: 'Рядовой — Ефрейтор: через 2 дня после КМБ. Ефрейтор — Сержант: дважды в неделю. Сержант — Прапорщик: раз в неделю. Прапорщик — Младший Лейтенант: после Офицерской Академии. Младший Лейтенант — Старший Лейтенант: на офицерском собрании, минимум 10 дней на звании.',
  },
];

interface CharterPageProps {
  isAdmin?: boolean;
}

const CharterPage = ({ isAdmin }: CharterPageProps) => {
  const [sections, setSections] = useState<CharterSection[]>(MOCK_CHARTER);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<CharterSection | null>(null);

  const handleSave = () => {
    if (!editingSection) return;

    if (editingSection.id === 'new') {
      setSections([...sections, { ...editingSection, id: Date.now().toString() }]);
    } else {
      setSections(sections.map(sec => sec.id === editingSection.id ? editingSection : sec));
    }

    setEditingSection(null);
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    setSections(sections.filter(sec => sec.id !== id));
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary tracking-wider">УСТАВ</h1>
        {isAdmin && (
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button
                className="gap-2"
                onClick={() => setEditingSection({ id: 'new', title: '', content: '' })}
              >
                <Icon name="Plus" size={18} />
                Добавить главу
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card max-w-2xl">
              <DialogHeader>
                <DialogTitle>Редактировать главу устава</DialogTitle>
              </DialogHeader>
              {editingSection && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Название главы</label>
                    <Input
                      value={editingSection.title}
                      onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                      className="mt-1"
                      placeholder="Глава 1. Название"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Содержание</label>
                    <Textarea
                      value={editingSection.content}
                      onChange={(e) => setEditingSection({ ...editingSection, content: e.target.value })}
                      className="mt-1 min-h-[200px]"
                      placeholder="Текст главы устава"
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
        {sections.map((section, index) => (
          <AccordionItem key={section.id} value={section.id} className="border-none">
            <Card className="military-border bg-card">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-4 w-full">
                  <div className="w-12 h-12 rounded bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {index + 1}
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-lg font-bold">{section.title}</h3>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingSection(section);
                          setIsEditing(true);
                        }}
                      >
                        <Icon name="Edit" size={14} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(section.id)}
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-foreground whitespace-pre-wrap">{section.content}</p>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CharterPage;
