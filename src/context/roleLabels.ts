
import { UserInputRole } from '@/api/generated/taskProgressAPI.schemas.ts';

export const ROLE_LABELS: Record<UserInputRole, string> = {
  [UserInputRole.SYSTEM_ADMIN]: 'システム管理者',
  [UserInputRole.ORG_ADMIN]: '組織管理者',
  [UserInputRole.MEMBER]: 'メンバー',
};