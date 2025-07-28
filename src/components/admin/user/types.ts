// src/admin/components/user/types.ts

//import type { User, AccessScope, OrganizationTreeNode } from '@/api/generated/taskProgressAPI.schemas';
import type { User, AccessScope } from '@/api/generated/taskProgressAPI.schemas';

/**
 * UI用のユーザーフォーム状態
 */
export interface UserFormState {
  id?: number;
  name: string;
  email: string;
  organization_code: string;
  role: 'system_admin' | 'admin' | 'member';
}

/**
 * 組織選択の結果
 */
export interface OrganizationSelectResult {
  org_code: string;
  org_name: string;
}

/**
 * テーブル行で扱うユーザー情報（アクセススコープ付）
 */
export interface UserWithScopes extends User {
  scopes?: AccessScope[];
}
