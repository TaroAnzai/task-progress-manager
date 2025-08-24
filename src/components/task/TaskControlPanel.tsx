// src/components/task/TaskControlPanel.tsx
import { useState } from 'react';

import { EyeIcon, Minus, PencilIcon, Plus, PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { NewTaskModal } from '@/components/task/newTaskModal/NewTaskModal';
import { TaskOrderSettingModal } from '@/components/task/taskSettingOrderModal/TaskOrderSettingModal';
import { TestModal } from '@/components/TestModal';
import { ViewSelectorPopup } from './ViewSelectorPopup';
import type { FilterAccessLevel } from '@/pages/TaskPage';
interface TaskControlPanelProps {
  onAllExpand: () => void;
  onAllCollapse: () => void;
  viewMode: Record<FilterAccessLevel, boolean>;
  onChangeViewMode: (newValue: Record<FilterAccessLevel, boolean>) => void;
}

export const TaskControlPanel = ({
  onAllExpand,
  onAllCollapse,
  viewMode,
  onChangeViewMode,
}: TaskControlPanelProps) => {
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [taskOrderModalOpen, setTaskOrderModalOpen] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between gap-2 mb-4" id="task-controls-box">
        <div className="flex gap-2 ">
          <Button
            onClick={() => {
              setNewTaskModalOpen(true);
            }}
            className="flex items-center gap-1"
          >
            <PlusIcon size={16} />
            新規
          </Button>

          <Button
            onClick={() => {
              setTaskOrderModalOpen(true);
            }}
            variant="secondary"
            className="flex items-center gap-1"
          >
            <PencilIcon size={16} />
            編集
          </Button>

          <Button
            onClick={() => {
              setTestModalOpen(true);
            }}
            variant="outline"
            id="view-selecter-btn"
            className="flex items-center gap-1"
          >
            <EyeIcon size={16} />
            表示切替
          </Button>
        </div>

        <div className="flex gap-2">
          <ViewSelectorPopup viewMode={viewMode} onChange={onChangeViewMode} />
          <Button className="" onClick={onAllExpand}>
            <Plus />
          </Button>
          <Button className="" onClick={onAllCollapse}>
            <Minus />
          </Button>
        </div>
      </div>
      <NewTaskModal open={newTaskModalOpen} onClose={() => setNewTaskModalOpen(false)} />
      <TaskOrderSettingModal
        open={taskOrderModalOpen}
        onClose={() => {
          setTaskOrderModalOpen(false);
        }}
      />
      <TestModal
        open={testModalOpen}
        onClose={() => {
          setTestModalOpen(false);
        }}
      />
    </>
  );
};
