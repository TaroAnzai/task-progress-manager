import api from './index';
import type { Organization } from '@/types/organization';

export async function getOrganizations(userId: number): Promise<Organization[]> {
  const res = await api.get<Organization[]>('/organizations', {
    params: { user_id: userId }
  });
  return res.data;
}

export async function createOrganization(data: {
  name: string;
  org_code: string;
  parent_code?: string;
}): Promise<Organization> {
  const res = await api.post<Organization>('/organizations', data);
  return res.data;
}

export async function updateOrganizationParent(
  orgCode: string,
  newParentCode: string
): Promise<Organization> {
  const res = await api.put<Organization>(`/organizations/${orgCode}`, {
    parent_code: newParentCode
  });
  return res.data;
}

export async function deleteOrganization(orgCode: string): Promise<{ message: string }> {
  const res = await api.delete<{ message: string }>(`/organizations/${orgCode}`);
  return res.data;
}

