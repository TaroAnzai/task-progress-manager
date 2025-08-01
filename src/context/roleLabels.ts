
import { UserInputRole } from '@/api/generated/taskProgressAPI.schemas.ts';

export const ROLE_LABELS: Record<UserInputRole, string> = {
  [UserInputRole.system_admin]: 'システム管理者',
  [UserInputRole.org_admin]: '組織管理者',
  [UserInputRole.member]: 'メンバー',
};