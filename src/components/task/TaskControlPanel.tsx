// src/components/task/TaskControlPanel.tsx

import { EyeIcon, Minus, PencilIcon, Plus, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
interface TaskControlPanelProps {
  onAddTask: () => void;
  onEditTasks: () => void;
  onToggleViewSelector: () => void;
  onAllExpand: () => void
  onAllCollapse: () => void
}

export const TaskControlPanel = ({
  onAddTask,
  onEditTasks,
  onToggleViewSelector,
  onAllExpand,
  onAllCollapse
}: TaskControlPanelProps) => (
  <div className="flex justify-between gap-2 mb-4" id="task-controls-box">
    <div className="flex gap-2 ">
      <Button onClick={onAddTask} className="flex items-center gap-1">
        <PlusIcon size={16} />
        新規
      </Button>

      <Button onClick={onEditTasks} variant="secondary" className="flex items-center gap-1">
        <PencilIcon size={16} />
        編集
      </Button>

      <Button
        onClick={onToggleViewSelector}
        variant="outline"
        id="view-selecter-btn"
        className="flex items-center gap-1"
      >
        <EyeIcon size={16} />
        表示切替
      </Button>
    </div>

    <div className="flex gap-2">
      <Button className="" onClick={onAllExpand}><Plus /></Button>
      <Button className="" onClick={onAllCollapse}><Minus /></Button>
    </div>

  </div>
);


