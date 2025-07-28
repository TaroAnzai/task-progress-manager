// src/components/admin/user/UserTable.tsx

import React, { useEffect, useState } from 'react';
import type { UserWithScopes } from './types';
import { useGetProgressAccessScopesUserId, useDeleteProgressUsersUserId } from '@/api/generated/taskProgressAPI';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import UserTableRow from './UserTableRow';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  users: UserWithScopes[];
  isLoading: boolean;
  error: unknown;
  onEditUser: (user: UserWithScopes) => void;
  onRefresh: () => void;
}

const UserTable: React.FC<Props> = ({ users, isLoading, error, onEditUser, onRefresh }) => {
  const [usersWithScopes, setUsersWithScopes] = useState<UserWithScopes[]>([]);

  useEffect(() => {
    const fetchScopes = async () => {
      const enrichedUsers = await Promise.all(
        users.map(async (user) => {
          try {
            const { data: scopes } = await useGetProgressAccessScopesUserId().queryFn({ userId: user.id! });
            return { ...user, scopes };
          } catch (err) {
            console.warn(`スコープ取得失敗: userId=${user.id}`, err);
            return { ...user, scopes: [] };
          }
        })
      );
      setUsersWithScopes(enrichedUsers);
    };

    if (users.length > 0) {
      fetchScopes();
    } else {
      setUsersWithScopes([]);
    }
  }, [users]);

  const handleDelete = async (userId: number) => {
    if (!confirm('本当にこのユーザーを削除しますか？')) return;

    try {
      await useDeleteProgressUsersUserId().mutateAsync({ userId });
      onRefresh();
    } catch (err) {
      alert('削除に失敗しました');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">ユーザー一覧の取得に失敗しました</div>;
  }

  if (usersWithScopes.length === 0) {
    return <div className="text-gray-600">ユーザーが存在しません</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>氏名</TableHead>
          <TableHead>メール</TableHead>
          <TableHead>組織</TableHead>
          <TableHead>ロール</TableHead>
          <TableHead>WP連携</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usersWithScopes.map(user => (
          <UserTableRow
            key={user.id}
            user={user}
            onEdit={() => onEditUser(user)}
            onDelete={() => handleDelete(user.id!)}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
