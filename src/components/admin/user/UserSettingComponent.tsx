import { useMemo, useState } from 'react';

import { Check, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

import { usePutProgressUsersUserId } from '@/api/generated/taskProgressAPI';
import type { User } from '@/api/generated/taskProgressAPI.schemas';

const calcStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  // 0..5 -> 0..100
  return Math.min(100, Math.round((score / 5) * 100));
};
interface UserSettingComponentProps {
  user: User;
  className?: string;
}

export const UserSettingComponent = ({ user, className }: UserSettingComponentProps) => {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [password2, setPassword2] = useState('');
  const strength = useMemo(() => calcStrength(password), [password]);
  const canSubmit = password.length >= 8 && password === password2;
  const { mutate: putUser, isPending } = usePutProgressUsersUserId({
    mutation: {
      onSuccess: () => {
        console.log('success');
      },
      onError: (err) => {
        console.error(err);
      },
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      password: password,
    };
    console.log('submit', payload);
  };
  return (
    <Card className={`p-4  ${className ?? ''}`}>
      <CardHeader>
        <CardTitle>ユーザー情報設定</CardTitle>
        <CardDescription>ユーザー情報の変更をします。</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">新しいパスワード</Label>
            <div className="relative">
              <Input
                className="w-96"
                id="password"
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8文字以上を推奨"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? 'パスワードを隠す' : 'パスワードを表示'}
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="space-y-1">
              <Progress value={strength} />
              <p className="text-xs text-muted-foreground">
                強度: {strength >= 80 ? '強い' : strength >= 50 ? '普通' : '弱い'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password2">新しいパスワード（確認）</Label>
            <Input
              id="password2"
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
            {password2.length > 0 && password !== password2 && (
              <p className="text-xs text-red-500">パスワードが一致しません</p>
            )}
          </div>

          <ul className="text-xs text-muted-foreground space-y-1">
            <li className="flex items-center gap-2">
              <Check className={`w-3 h-3 ${password.length >= 8 ? 'text-emerald-600' : ''}`} />
              8文字以上
            </li>
            <li className="flex items-center gap-2">
              <Check className={`w-3 h-3 ${/[0-9]/.test(password) ? 'text-emerald-600' : ''}`} />
              数字を含む
            </li>
            <li className="flex items-center gap-2">
              <Check className={`w-3 h-3 ${/[A-Za-z]/.test(password) ? 'text-emerald-600' : ''}`} />
              英字を含む
            </li>
          </ul>

          <Button type="submit" className="w-full" disabled={!canSubmit || isPending}>
            {isPending ? '更新中...' : 'パスワードを更新する'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
