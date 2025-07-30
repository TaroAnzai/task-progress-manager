// src/admin/components/user/types.ts

//import type { User, AccessScope, OrganizationTreeNode } from '@/api/generated/taskProgressAPI.schemas';
import type { User, AccessScope } from '@/api/generated/taskProgressAPI.schemas';

/**
 * UI用のユーザーフォーム状態
 */
export interface UserFormState {
  id: number;
  name: string;
  email: string;
  //organization_code: string;
  organization_id: number;
  role: 'system_admin' | 'org_admin' | 'member';
}

/**
 * 組織選択の結果
 */
export interface OrganizationSelectResult {
  org_code: string;
  org_name: string;
  org_id: number;
}

