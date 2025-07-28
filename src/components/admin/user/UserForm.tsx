// src/components/admin/user/UserForm.tsx

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useCreateProgressUsers, useUpdateProgressUsersUserId, useCreateProgressAccessScopes } from '@/api/generated/taskProgressAPI';
import { UserFormState, OrganizationSelectResult } from './types';
import OrganizationSelectorDialog from './OrganizationSelectorDialog';

interface UserFormProps {
  initialData: UserFormState | null;
  companyId: number;
  onSubmitted: () => void;
  onCancel: () => void;
}

const emptyForm: UserFormState = {
  name: '',
  email: '',
  organization_code: '',
  role: 'member',
};

const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmitted, onCancel }) => {
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [orgDialogOpen, setOrgDialogOpen] = useState(false);
  const [orgDisplayName, setOrgDisplayName] = useState<string>('組織を選択');

  const createUserMutation = useCreateProgressUsers();
  const updateUserMutation = useUpdateProgressUsersUserId();
  const addScopeMutation = useCreateProgressAccessScopes();

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setOrgDisplayName(initialData.organization_code ? `(${initialData.organization_code})` : '組織を選択');
    } else {
      setForm(emptyForm);
      setOrgDisplayName('組織を選択');
    }
  }, [initialData]);

  const handleChange = (key: keyof UserFormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleOrgSelect = (org: OrganizationSelectResult) => {
    setForm(prev => ({ ...prev, organization_code: org.org_code }));
    setOrgDisplayName(`${org.org_name} (${org.org_code})`);
    setOrgDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.organization_code) {
      alert('名前、メール、組織コードは必須です');
      return;
    }

    try {
      if (form.id) {
        await updateUserMutation.mutateAsync({
          userId: form.id,
          data: {
            name: form.name,
            email: form.email,
            organization_code: form.organization_code,
          },
        });
        await addScopeMutation.mutateAsync({
          data: {
            user_id: form.id,
            organization_code: form.organization_code,
            role: form.role,
          },
        });
      } else {
        const result = await createUserMutation.mutateAsync({
          data: {
            name: form.name,
            email: form.email,
            organization_code: form.organization_code,
          },
        });

        await addScopeMutation.mutateAsync({
          data: {
            user_id: result.user.id,
            organization_code: form.organization_code,
            role: form.role,
          },
        });
      }

      onSubmitted();
    } catch (err) {
      alert('ユーザー登録に失敗しました');
      console.error(err);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        placeholder="氏名"
        value={form.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />
      <Input
        type="email"
        placeholder="メールアドレス"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
      />

      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" onClick={() => setOrgDialogOpen(true)}>
          {orgDisplayName}
        </Button>
        <Select value={form.role} onValueChange={(val) => handleChange('role', val as UserFormState['role'])}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="権限" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="system_admin">システム管理者</SelectItem>
            <SelectItem value="admin">組織管理者</SelectItem>
            <SelectItem value="member">メンバー</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>キャンセル</Button>
        <Button type="submit">{form.id ? '更新' : '登録'}</Button>
      </div>

      <OrganizationSelectorDialog
        companyId={companyId}
        open={orgDialogOpen}
        onClose={() => setOrgDialogOpen(false)}
        onSelect={handleOrgSelect}
      />
    </form>
  );
};

export default UserForm;
