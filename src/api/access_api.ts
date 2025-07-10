import api from './index';
import { getCurrentUserId } from '@/utils/auth';
import type { TaskAccessUser, TaskAccessOrganization } from '@/types/access';

// タスクのアクセスレベル（ユーザー・組織）を取得
export async function getTaskScope(taskId: number): Promise<{
  users: TaskAccessUser[];
  organizations: TaskAccessOrganization[];
}> {
  const userId = getCurrentUserId();
  const res = await api.get<{ users: TaskAccessUser[]; organizations: TaskAccessOrganization[] }>(`/tasks/${taskId}/scope`, {
    params: { user_id: userId }
  });
  return res.data;
}

// タスクのアクセスレベルを更新（ユーザー＋組織）
export async function updateAccessLevel(taskId: number, {
  userAccess = [],
  orgAccess = []
}: {
  userAccess?: TaskAccessUser[];
  orgAccess?: TaskAccessOrganization[];
}): Promise<{ message: string }> {
  const payload = {
    user_id: getCurrentUserId(),
    user_access: userAccess,
    organization_access: orgAccess
  };
  const res = await api.put<{ message: string }>(`/tasks/${taskId}/scope/access_levels`, payload);
  return res.data;
}

// ユーザーごとのアクセス情報を取得
export async function fetchTaskAccessUsers(taskId: number): Promise<TaskAccessUser[]> {
  const res = await api.get<TaskAccessUser[]>(`/tasks/${taskId}/access_users`);
  return res.data;
}

// 組織ごとのアクセス情報を取得
export async function fetchTaskAccessOrganizations(taskId: number): Promise<TaskAccessOrganization[]> {
  const res = await api.get<TaskAccessOrganization[]>(`/tasks/${taskId}/access_organization`);
  return res.data;
}

// スコープユーザー一覧（access_levelがedit以上）を取得
export async function fetchUsersByTaskId(taskId: number): Promise<TaskAccessUser[]> {
  const res = await api.get<TaskAccessUser[]>(`/tasks/${taskId}/users`);
  return res.data;
}
