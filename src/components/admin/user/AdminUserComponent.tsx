// src/admin/components/user/AdminUserComponent.tsx

import React, { useState, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import type { UserFormState, UserWithScopes } from './types';
import { useGetProgressUsers } from '@/api/generated/taskProgressAPI';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import UserForm from './UserForm';
import UserTable from './UserTable';

interface AdminUserComponentProps {
  companyId: number;
}


const AdminUserComponent: React.FC <AdminUserComponentProps> = ({ companyId }) => {
  const { user, hasAdminScope } = useUser();
  const [editingUser, setEditingUser] = useState<UserFormState | null>(null);

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useGetProgressUsers();

  const handleEditUser = useCallback((user: UserWithScopes) => {
    const matchedScope = user.scopes?.find(s => s.organization_id === user.organization_id);
    setEditingUser({
      id: user.id,
      name: user.name,
      email: user.email,
      //organization_code: user.organization_code,
      organization_id: user.organization_id,
      role: matchedScope?.role ?? 'member',
    });
  }, []);

  const handleFormSubmitted = useCallback(() => {
    setEditingUser(null);
    refetch(); // 一覧更新
  }, [refetch]);

  if (!hasAdminScope()) {
    return (
      <div className="p-4 text-red-600 font-semibold">
        このユーザーにはユーザー管理の権限がありません
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-4">👤 ユーザー登録・編集</h2>
          <UserForm
            initialData={editingUser}
            companyId={companyId}
            onSubmitted={handleFormSubmitted}
            onCancel={() => setEditingUser(null)}
          />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-4">📋 ユーザー一覧</h2>
          <UserTable
            users={users ?? []}
            isLoading={isLoading}
            error={error}
            onEditUser={handleEditUser}
            onRefresh={refetch}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserComponent;
