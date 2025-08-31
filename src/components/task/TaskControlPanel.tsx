// src/components/task/TaskControlPanel.tsx
import { useEffect, useMemo, useState } from 'react';

import { FileDown, FilePlus, Minus, PencilIcon, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { useGetProgressExportsExcel } from '@/api/generated/taskProgressAPI';

import { NewTaskModal } from '@/components/task/newTaskModal/NewTaskModal';
import { TaskOrderSettingModal } from '@/components/task/taskSettingOrderModal/TaskOrderSettingModal';
import { TestModal } from '@/components/TestModal';

import type { FilterAccessLevel } from '@/pages/TaskPage';

import { ViewSelectorPopup } from './ViewSelectorPopup';
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
  // ① 自動実行は無効化（ボタン押下で refetch）
  const {
    refetch: downloadFile,
    isFetching,
    error,
  } = useGetProgressExportsExcel({
    query: { enabled: false, refetchOnWindowFocus: false },
  });

  const handleDownload = async () => {
    try {
      const res= await downloadFile();
      const data = res.data;
      const headers = res.;
      if(!data) return;
      const cd = (data.headers?.['content-disposition'];
    } catch (e) {
      console.error(e);
    }
  };

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
            <FilePlus size={16} />
            新規
          </Button>

          <Button
            onClick={() => {
              setTaskOrderModalOpen(true);
            }}
            variant="outline"
            className="flex items-center gap-1"
          >
            <PencilIcon size={16} />
            編集
          </Button>

          <Button
            onClick={() => {
              downloadFile();
            }}
            variant="secondary"
            id="view-selecter-btn"
            className="flex items-center gap-1"
          >
            {isFetching ? (
              <>'Excel出力中...'</>
            ) : (
              <>
                <FileDown size={16} />
                ダウンロード
              </>
            )}
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
