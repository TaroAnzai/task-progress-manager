import api from './index';
import type {User,AccessScope} from '@/types/user'

export async function loginByWpId(wpUserId: number): Promise<User> {
  const res = await api.post<User>('/login/by-id', { wp_user_id: wpUserId });
  return res.data;
}

export async function checkUser(wpUserId: number): Promise<User> {
  const res = await api.get<User>(`/users/id-lookup`, {
    params: { wp_user_id: wpUserId }
  });
  return res.data;
}

export async function getUserByEmail(email: string): Promise<User> {
  const res = await api.get<User>(`/users/by-email`, {
    params: { email }
  });
  return res.data;
}

export async function getUsers(userId: number): Promise<User[]> {
  const res = await api.get<User[]>(`/users`, {
    params: { user_id: userId }
  });
  return res.data;
}

export async function createUser(data: {
  name: string;
  email: string;
  wp_user_id?: number;
  organization_code?: string;
}): Promise<User> {
  const res = await api.post<User>('/users', data);
  return res.data;
}

export async function updateUser(userId: number, updateFields: Partial<User>): Promise<User> {
  const res = await api.put<User>(`/users/${userId}`, updateFields);
  return res.data;
}

export async function deleteUser(userId: number): Promise<{ message: string }> {
  const res = await api.delete<{ message: string }>(`/users/${userId}`);
  return res.data;
}

export async function getUserAccessScopes(userId: number): Promise<AccessScope[]> {
  const res = await api.get<AccessScope[]>(`/users/${userId}/access-scopes`);
  return res.data;
}

export async function addAccessScope(
  userId: number,
  organization_code: string,
  role: string
): Promise<AccessScope> {
  const res = await api.post<AccessScope>(`/users/${userId}/access-scopes`, {
    organization_code,
    role
  });
  return res.data;
}
