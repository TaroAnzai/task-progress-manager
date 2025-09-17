// src/components/task/TaskSettingsIcon.tsx
import { useState } from 'react';

import { Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { Task } from '@/api/generated/taskProgressAPI.schemas';

import { ObjectiveListModal } from './objectiveListModal/ObjectiveListModal';
import { TaskScopeModal } from './taskScopeModal/TaskScopeModal.tsx';
import { TaskSettingModal } from './taskSettingModal/TaskSettingModal';

interface TaskSettingsIconProps {
  task: Task;
  isUpdateTask: boolean;
}

export const TaskSettingsIcon = ({ task, isUpdateTask }: TaskSettingsIconProps) => {
  const [openSetting, setOpenSetting] = useState(false);
  const [openScope, setOpenScope] = useState(false);
  const [openObjectiveModal, setOpenObjectiveModal] = useState(false);

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
            <Settings className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem disabled={!isUpdateTask} onClick={() => setOpenSetting(true)}>
            設定
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!isUpdateTask} onClick={() => setOpenScope(true)}>
            スコープ設定
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenObjectiveModal(true)}>
            オブジェクティブ一覧
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 設定モーダル */}
      {openSetting && (
        <TaskSettingModal open={openSetting} task={task} onClose={() => setOpenSetting(false)} />
      )}
      {/* スコープ設定モーダル */}
      {openScope && (
        <TaskScopeModal open={openScope} task={task} onClose={() => setOpenScope(false)} />
      )}

      {/* オブジェクティブ一覧モーダル */}
      {openObjectiveModal && (
        <ObjectiveListModal
          open={openObjectiveModal}
          task={task}
          onClose={() => setOpenObjectiveModal(false)}
          canUpdate={isUpdateTask}
        />
      )}
    </>
  );
};
