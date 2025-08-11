// src/components/task/TaskControlPanel.tsx

import { PlusIcon, PencilIcon, EyeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TaskControlPanelProps {
  onAddTask: () => void;
  onEditTasks: () => void;
  onToggleViewSelector: () => void;
}

const TaskControlPanel = ({
  onAddTask,
  onEditTasks,
  onToggleViewSelector,
}: TaskControlPanelProps) => (
  <div className="flex gap-2 mb-4" id="task-controls-box">
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
);

export default TaskControlPanel;
