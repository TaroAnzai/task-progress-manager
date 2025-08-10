// src/components/task/TaskSettingsIcon.tsx
import { useState } from 'react';

import { Cog } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { Task, UserWithScopes } from '@/api/generated/taskProgressAPI.schemas';

import { TaskScopeModal}  from './taskScopeModal/TaskScopeModal.tsx';
import { TaskSettingModal } from './taskSettingModal/TaskSettingModal';

interface TaskSettingsIconProps {
  task: Task;
  user: UserWithScopes | null;
}

export default function TaskSettingsIcon({ task}: TaskSettingsIconProps) {
  const [openSetting, setOpenSetting] = useState(false);
  const [openScope, setOpenScope] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-gray-900"
            title="設定"
          >
            <Cog className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => setOpenSetting(true)}>
            設定
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenScope(true)}>
            スコープ設定
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 設定モーダル */}
      <TaskSettingModal
        open={openSetting}
        task={task}
        onClose={() => setOpenSetting(false)}
      />

      {/* スコープ設定モーダル */}
      <TaskScopeModal
        open={openScope}
        task={task}
        onClose={() => setOpenScope(false)}
      />
    </>
  );
}
