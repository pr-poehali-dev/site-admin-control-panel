import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface UserProfile {
  id: string;
  code: string;
  nickname: string;
  rank: string;
  position: string;
  avatar?: string;
  bio?: string;
  awards: string[];
  pendingAvatar?: string;
}

interface AvatarRequest {
  userId: string;
  nickname: string;
  avatar: string;
  timestamp: Date;
}

interface ProfilePageProps {
  user: UserProfile;
  isModerator?: boolean;
  onProfileUpdate: (profile: UserProfile) => void;
  onAvatarApprove?: (userId: string) => void;
  onAvatarReject?: (userId: string) => void;
  pendingAvatars?: AvatarRequest[];
}

const ProfilePage = ({ 
  user, 
  isModerator, 
  onProfileUpdate, 
  onAvatarApprove, 
  onAvatarReject,
  pendingAvatars = []
}: ProfilePageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(user);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [showPendingDialog, setShowPendingDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = () => {
    onProfileUpdate(editedProfile);
    setIsEditing(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const avatarData = reader.result as string;
        setEditedProfile({ ...editedProfile, pendingAvatar: avatarData });
      };
      reader.readAsDataURL(file);
    }
    setShowAvatarDialog(false);
  };

  const handleAvatarFromUrl = () => {
    if (avatarUrl.trim()) {
      setEditedProfile({ ...editedProfile, pendingAvatar: avatarUrl });
      setAvatarUrl('');
      setShowAvatarDialog(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary tracking-wider">ПРОФИЛЬ</h1>
        {isModerator && pendingAvatars.length > 0 && (
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowPendingDialog(true)}
          >
            <Icon name="Bell" size={18} />
            Заявки на аватарки ({pendingAvatars.length})
          </Button>
        )}
      </div>

      <Card className="military-border bg-card p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                {(editedProfile.pendingAvatar || editedProfile.avatar) ? (
                  <img 
                    src={editedProfile.pendingAvatar || editedProfile.avatar} 
                    alt={editedProfile.nickname} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon name="User" size={64} className="text-primary" />
                )}
              </div>
              {editedProfile.pendingAvatar && (
                <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-600">
                  На модерации
                </Badge>
              )}
            </div>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAvatarDialog(true)}
                className="gap-2"
              >
                <Icon name="Upload" size={16} />
                Изменить аватар
              </Button>
            )}
          </div>

          <div className="flex-1 space-y-4">
            {!isEditing ? (
              <>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Код доступа</label>
                  <p className="text-lg font-mono">{user.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Игровой ник</label>
                  <p className="text-xl font-bold">{user.nickname}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Звание</label>
                  <p className="text-lg">{user.rank}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Должность</label>
                  <p className="text-lg">{user.position}</p>
                </div>
                {user.bio && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">О себе</label>
                    <p className="text-foreground">{user.bio}</p>
                  </div>
                )}
                {user.awards && user.awards.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Награды</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {user.awards.map((award, idx) => (
                        <Badge key={idx} variant="secondary" className="text-lg px-3 py-1">
                          {award}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <Button onClick={() => setIsEditing(true)} className="mt-6">
                  <Icon name="Edit" size={16} className="mr-2" />
                  Редактировать профиль
                </Button>
              </>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium">О себе</label>
                  <Textarea
                    value={editedProfile.bio || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                    placeholder="Расскажите о себе"
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveProfile}>
                    Сохранить изменения
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditedProfile(user);
                      setIsEditing(false);
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Изменить аватар</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Ссылка на изображение</label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
                <Button onClick={handleAvatarFromUrl}>
                  Применить
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">или</span>
              </div>
            </div>
            <div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full gap-2"
              >
                <Icon name="Upload" size={16} />
                Загрузить с компьютера
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Аватар будет установлен после одобрения модератором
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPendingDialog} onOpenChange={setShowPendingDialog}>
        <DialogContent className="bg-card max-w-2xl">
          <DialogHeader>
            <DialogTitle>Заявки на смену аватара</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {pendingAvatars.map((request, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={request.avatar}
                    alt={request.nickname}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-bold">{request.nickname}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(request.timestamp).toLocaleString('ru-RU')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onAvatarApprove && onAvatarApprove(request.userId)}
                    >
                      <Icon name="Check" size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onAvatarReject && onAvatarReject(request.userId)}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
