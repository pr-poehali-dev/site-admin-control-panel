import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import Icon from '@/components/ui/icon';

interface NewsPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  image?: string;
  reactions: number;
  authorId?: string;
  reactedUsers: string[];
}

const MOCK_NEWS: NewsPost[] = [
  {
    id: '1',
    title: 'Приказ о повышении сержантского состава',
    content: 'В соответствии с графиком повышений объявляется о присвоении очередных званий сержантскому составу. Повышения состоятся в субботу в 20:00 по МСК. Все кандидаты должны явиться на построение.',
    author: 'Генерал Командир',
    date: '2026-01-08',
    reactions: 12,
    reactedUsers: [],
  },
  {
    id: '2',
    title: 'Открыта запись в Офицерскую Академию',
    content: 'Начат набор в Офицерскую Академию для прапорщиков, желающих получить офицерское звание. Для записи обратитесь к командованию. Экзамены пройдут 15 января.',
    author: 'Полковник Петров',
    date: '2026-01-07',
    reactions: 24,
    reactedUsers: [],
  },
];

interface NewsPageProps {
  canEdit?: boolean;
  currentUser: { nickname: string } | null;
}

const NewsPage = ({ canEdit, currentUser }: NewsPageProps) => {
  const [news, setNews] = useState<NewsPost[]>(MOCK_NEWS);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', image: '' });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formatting, setFormatting] = useState({ bold: false, italic: false, underline: false });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAddPost = () => {
    if (!newPost.title || !newPost.content || !currentUser) return;

    if (editingPost) {
      setNews(news.map(post => 
        post.id === editingPost.id 
          ? { ...post, title: newPost.title, content: newPost.content, image: selectedImage || undefined }
          : post
      ));
      setEditingPost(null);
    } else {
      const post: NewsPost = {
        id: Date.now().toString(),
        title: newPost.title,
        content: newPost.content,
        author: currentUser.nickname,
        date: new Date().toISOString().split('T')[0],
        reactions: 0,
        image: selectedImage || undefined,
        authorId: currentUser.nickname,
        reactedUsers: [],
      };
      setNews([post, ...news]);
    }

    setNewPost({ title: '', content: '', image: '' });
    setSelectedImage(null);
    setIsAddingPost(false);
  };

  const handleEditPost = (post: NewsPost) => {
    setEditingPost(post);
    setNewPost({ title: post.title, content: post.content, image: post.image || '' });
    setSelectedImage(post.image || null);
    setIsAddingPost(true);
  };

  const handleDeletePost = (postId: string) => {
    setNews(news.filter(post => post.id !== postId));
    setDeletingPostId(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFormatting = (format: 'bold' | 'italic' | 'underline' | 'heading') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newPost.content.substring(start, end);
    let formattedText = '';

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      case 'heading':
        formattedText = `### ${selectedText}`;
        break;
    }

    const newContent = 
      newPost.content.substring(0, start) + 
      formattedText + 
      newPost.content.substring(end);

    setNewPost({ ...newPost, content: newContent });
  };

  const renderFormattedText = (text: string) => {
    return text
      .split('\n')
      .map((line, i) => {
        const formatted = line
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
          .replace(/__(.+?)__/g, '<u>$1</u>')
          .replace(/^### (.+)$/g, '<h3 class="text-lg font-bold mt-2 mb-1">$1</h3>');
        
        return <div key={i} dangerouslySetInnerHTML={{ __html: formatted }} />;
      });
  };

  const handleReaction = (postId: string) => {
    if (!currentUser || currentUser.nickname === 'guest') return;
    
    setNews(news.map(post => {
      if (post.id !== postId) return post;
      
      const hasReacted = post.reactedUsers.includes(currentUser.nickname);
      
      if (hasReacted) {
        return {
          ...post,
          reactions: post.reactions - 1,
          reactedUsers: post.reactedUsers.filter(u => u !== currentUser.nickname),
        };
      } else {
        return {
          ...post,
          reactions: post.reactions + 1,
          reactedUsers: [...post.reactedUsers, currentUser.nickname],
        };
      }
    }));
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
            <DialogContent className="bg-card max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPost ? 'Редактировать новость' : 'Создать новость'}</DialogTitle>
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
                  <label className="text-sm font-medium">Изображение</label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Icon name="Upload" size={16} />
                      Загрузить
                    </Button>
                    {selectedImage && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setSelectedImage(null)}
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  {selectedImage && (
                    <img src={selectedImage} alt="Preview" className="mt-2 max-h-40 rounded" />
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Содержание</label>
                  <div className="border rounded p-2 mt-1 space-y-2">
                    <div className="flex gap-1 border-b pb-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => applyFormatting('bold')}
                        title="Жирный"
                      >
                        <Icon name="Bold" size={16} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => applyFormatting('italic')}
                        title="Курсив"
                      >
                        <Icon name="Italic" size={16} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => applyFormatting('underline')}
                        title="Подчёркнутый"
                      >
                        <Icon name="Underline" size={16} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => applyFormatting('heading')}
                        title="Заголовок"
                      >
                        <Icon name="Heading" size={16} />
                      </Button>
                    </div>
                    <textarea
                      ref={textareaRef}
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      placeholder="Введите текст новости. Выделите текст и используйте кнопки форматирования."
                      className="w-full min-h-[250px] bg-transparent resize-none focus:outline-none"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Совет: выделите текст и нажмите кнопку форматирования
                  </p>
                </div>
                <Button onClick={handleAddPost} className="w-full">
                  {editingPost ? 'Сохранить' : 'Опубликовать'}
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
              <div className="flex-1">
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
              {canEdit && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPost(post)}
                  >
                    <Icon name="Edit" size={14} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeletingPostId(post.id)}
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              )}
            </div>
            {post.image && (
              <img src={post.image} alt={post.title} className="w-full rounded mb-4 max-h-96 object-cover" />
            )}
            <div className="text-foreground mb-4">{renderFormattedText(post.content)}</div>
            <div className="flex items-center gap-2">
              <Button
                variant={currentUser && post.reactedUsers.includes(currentUser.nickname) ? 'default' : 'outline'}
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

      <AlertDialog open={!!deletingPostId} onOpenChange={() => setDeletingPostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить новость?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Новость будет удалена навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingPostId && handleDeletePost(deletingPostId)}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NewsPage;