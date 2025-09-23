// src/components/task/TaskControlPanel.tsx
import { useState } from 'react';

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
  onSelectUser: (userId: number | null) => void;
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
  const { refetch: downloadFile, isFetching } = useGetProgressExportsExcel({
    query: { enabled: false, refetchOnWindowFocus: false },
  });

  const handleDownload = async () => {
    try {
      const res = await downloadFile();
      if (!res.data || res.data instanceof Blob === false) {
        toast.error('ファイルが取得できませんでした');
        return;
      }
      const blob = res.data;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tasks.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
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
            タスク新規作成
          </Button>

          <Button
            onClick={() => {
              setTaskOrderModalOpen(true);
            }}
            variant="outline"
            className="flex items-center gap-1"
          >
            <PencilIcon size={16} />
            表示順変更・削除
          </Button>

          <Button
            onClick={() => {
              handleDownload();
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
      {newTaskModalOpen && (
        <NewTaskModal open={newTaskModalOpen} onClose={() => setNewTaskModalOpen(false)} />
      )}
      {taskOrderModalOpen && (
        <TaskOrderSettingModal
          open={taskOrderModalOpen}
          onClose={() => {
            setTaskOrderModalOpen(false);
          }}
        />
      )}

      <TestModal
        open={testModalOpen}
        onClose={() => {
          setTestModalOpen(false);
        }}
      />
    </>
  );
};
