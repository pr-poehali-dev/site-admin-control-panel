import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface NewsPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  image?: string;
  reactions: number;
}

const MOCK_NEWS: NewsPost[] = [
  {
    id: '1',
    title: 'Приказ о повышении сержантского состава',
    content: 'В соответствии с графиком повышений объявляется о присвоении очередных званий сержантскому составу. Повышения состоятся в субботу в 20:00 по МСК. Все кандидаты должны явиться на построение.',
    author: 'Генерал Командир',
    date: '2026-01-08',
    reactions: 12,
  },
  {
    id: '2',
    title: 'Открыта запись в Офицерскую Академию',
    content: 'Начат набор в Офицерскую Академию для прапорщиков, желающих получить офицерское звание. Для записи обратитесь к командованию. Экзамены пройдут 15 января.',
    author: 'Полковник Петров',
    date: '2026-01-07',
    reactions: 24,
  },
];

interface NewsPageProps {
  canEdit?: boolean;
  currentUser: { nickname: string } | null;
}

const NewsPage = ({ canEdit, currentUser }: NewsPageProps) => {
  const [news, setNews] = useState<NewsPost[]>(MOCK_NEWS);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  const handleAddPost = () => {
    if (!newPost.title || !newPost.content || !currentUser) return;

    const post: NewsPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: currentUser.nickname,
      date: new Date().toISOString().split('T')[0],
      reactions: 0,
    };

    setNews([post, ...news]);
    setNewPost({ title: '', content: '' });
    setIsAddingPost(false);
  };

  const handleReaction = (postId: string) => {
    if (!currentUser || currentUser.nickname === 'guest') return;
    
    setNews(news.map(post => 
      post.id === postId 
        ? { ...post, reactions: post.reactions + 1 }
        : post
    ));
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary tracking-wider">НОВОСТИ</h1>
        {canEdit && (
          <Dialog open={isAddingPost} onOpenChange={setIsAddingPost}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Icon name="Plus" size={18} />
                Добавить пост
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card max-w-2xl">
              <DialogHeader>
                <DialogTitle>Создать новость</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Заголовок</label>
                  <Input
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Введите заголовок"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Содержание</label>
                  <Textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Введите текст новости"
                    className="mt-1 min-h-[200px]"
                  />
                </div>
                <Button onClick={handleAddPost} className="w-full">
                  Опубликовать
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-6">
        {news.map((post) => (
          <Card key={post.id} className="military-border bg-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icon name="User" size={14} />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Calendar" size={14} />
                    {new Date(post.date).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-foreground mb-4 whitespace-pre-wrap">{post.content}</p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReaction(post.id)}
                disabled={!currentUser}
                className="gap-2"
              >
                <Icon name="ThumbsUp" size={16} />
                {post.reactions}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
