// src/components/task/TaskSettingsIcon.tsx

import type { Task, UserWithScopes } from '@/api/generated/taskProgressAPI.schemas';
import { Cog } from 'lucide-react';
import { Button } from '@/components/ui/button';
//import taskSettingModal from '@/lib/task_setting_modal';

interface TaskSettingsIconProps {
  task: Task;
  user: UserWithScopes | null;
}

export default function TaskSettingsIcon({ task, user }: TaskSettingsIconProps) {
  const handleClick = () => {
    if (user) {
     // taskSettingModal.init(task, user);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="text-gray-600 hover:text-gray-900"
      title="設定"
    >
      <Cog className="h-5 w-5" />
    </Button>
  );
}
