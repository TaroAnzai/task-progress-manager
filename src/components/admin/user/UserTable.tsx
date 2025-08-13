// src/components/admin/user/UserTable.tsx

import { toast } from "sonner";

import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { useDeleteProgressUsersUserId } from '@/api/generated/taskProgressAPI';
import type { UserSchemaForAdmin } from '@/api/generated/taskProgressAPI.schemas';

import { extractErrorMessage } from "@/utils/errorHandler";

import { UserTableRow } from './UserTableRow';

interface Props {
  users: UserSchemaForAdmin[];
  isLoading: boolean;
  error: unknown;
  onEditUser: (user: UserSchemaForAdmin) => void;
  onRefresh: () => void;
}

export const UserTable: React.FC<Props> = ({ users, isLoading, error, onEditUser, onRefresh }) => {
  const { mutateAsync: deleteUser } = useDeleteProgressUsersUserId();
  const handleDelete = async (userId: number) => {
    if (!confirm('本当にこのユーザーを削除しますか？')) return;
    try {
      await deleteUser({ userId });
      onRefresh();
    } catch (err) {
      toast.error(`${extractErrorMessage(err)}`);
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

  if (users.length === 0) {
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
        {users.map(user => (
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

