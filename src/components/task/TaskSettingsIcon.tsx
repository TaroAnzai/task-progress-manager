// src/components/task/TaskSettingsIcon.tsx
import { useState } from 'react';
import type { Task, UserWithScopes } from '@/api/generated/taskProgressAPI.schemas';
import { Cog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskSettingModal } from './taskSettingModal/TaskSettingModal';
//import taskSettingModal from '@/lib/task_setting_modal';

interface TaskSettingsIconProps {
  task: Task;
  user: UserWithScopes | null;
}

export default function TaskSettingsIcon({ task, user }: TaskSettingsIconProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="text-gray-600 hover:text-gray-900"
        title="設定"
      >
        <Cog className="h-5 w-5" />
      </Button>
      <TaskSettingModal
        open={open}
        task={task}
        onClose={() => setOpen(false)}
      />
    </>

  );
}
