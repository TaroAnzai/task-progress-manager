// src/components/task/ObjectiveTable.tsx
import { useEffect, useState } from 'react';

import { toast } from "sonner";

import { Skeleton } from '@/components/ui/skeleton';

import { useGetProgressObjectivesTasksTaskId, usePutProgressObjectivesObjectiveId } from '@/api/generated/taskProgressAPI';
import { usePostProgressObjectives } from "@/api/generated/taskProgressAPI";
import type { ObjectiveInput, ObjectiveUpdate } from '@/api/generated/taskProgressAPI.schemas';
import type { Objective } from "@/api/generated/taskProgressAPI.schemas";

import { extractErrorMessage } from "@/utils/errorHandler";

import { useUser } from '@/context/useUser';

import { ObjectiveRow } from "./objective/ObjectiveRow";

interface ObjectiveTableProps {
  taskId: number;
}

export const ObjectiveTable = ({ taskId }: ObjectiveTableProps) => {
  const { user } = useUser();

  const { data, isLoading, refetch: refetchObjectives } =  useGetProgressObjectivesTasksTaskId(taskId);
  const postObjective = usePostProgressObjectives();
  const updateObjective = usePutProgressObjectivesObjectiveId();

  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<'top' | 'bottom' | null>(null);

  useEffect(() => {
    if (data) {
      setObjectives(data.objectives ?? []);
    }
  }, [data]);
  if (!user) return;
  // ObjectiveTable内に追加：新規登録関数
  const handleSaveNew = async (obj: ObjectiveInput) => {
    if (!obj.title || !obj.title.trim()) {
      console.warn("タイトルが入力されていません");
      return;
    }

    try {
      await postObjective.mutateAsync({
        data: {
          title: obj.title.trim(),
          due_date: obj.due_date ?? null,
          assigned_user_id: obj.assigned_user_id ?? user.id,
          task_id: taskId, // propsから渡されている
        },
      });

      // 登録後に再フェッチ（React Queryのキャッシュ更新）
      refetchObjectives();
      toast.success("Objectiveを登録しました");
    } catch (e) {
      const err = extractErrorMessage(e);
      console.error("Objective登録失敗:", err);
      toast.error("Objective登録に失敗しました", { description: err });
    }
  };

  const handleUpdate = async (objId: number, updates: ObjectiveUpdate) => {
    if (!objId) {
      console.warn("無効なIDです");
      return;
    }

    // 空文字だけのタイトルは保存させない（任意）
    if (typeof updates.title === "string" && updates.title.trim() === "") {
      console.warn("タイトルが空文字のため更新しません");
      return;
    }

    try {
      await updateObjective.mutateAsync({
        objectiveId: objId,
        data: updates,
      });

      // 更新後に再フェッチ（React Queryのキャッシュ更新）
      refetchObjectives();
      toast.success("Objectiveを更新しました");
    } catch (e) {
      const err = extractErrorMessage(e);
      console.error(`Objective ID ${objId} の更新に失敗しました`, e);
      toast.error("Objective更新に失敗しました", { description: err });
    }
  };

  if (isLoading) {
    return <Skeleton className="h-16 w-full" />;
  }

// ドラッグ開始
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    
    // ドラッグ中の要素のスタイル
    const target = e.target as HTMLElement;
    const row = target.closest('tr');
    if (row) {
      row.classList.add('opacity-50');
    }
  };

  // ドラッグ中
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (draggedIndex === null || draggedIndex === index) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const isAbove = e.clientY < midpoint;
    console.log('index', index,'e.clientY', e.clientY,'rect.top', rect.top,'rect.height', rect.height,'midpoint', midpoint) ;
    console.log('isAbove', isAbove);
    setDragOverIndex(index);
    setDragOverPosition(isAbove ? 'top' : 'bottom');
  };

  // ドラッグ離脱
  const handleDragLeave = () => {
    setDragOverIndex(null);
    setDragOverPosition(null);
  };

  // ドロップ
  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === targetIndex) {
      resetDragState();
      return;
    }

    try {
      const newObjectives = [...objectives];
      const draggedItem = newObjectives[draggedIndex];
      
      // 配列から削除
      newObjectives.splice(draggedIndex, 1);
      
      // 新しい位置に挿入
      let insertIndex = targetIndex;
      if (dragOverPosition === 'bottom') {
        insertIndex = targetIndex + 1;
      }
      if (draggedIndex < targetIndex && dragOverPosition === 'top') {
        insertIndex = targetIndex;
      } else if (draggedIndex < targetIndex && dragOverPosition === 'bottom') {
        insertIndex = targetIndex;
      }

      newObjectives.splice(insertIndex, 0, draggedItem);
      
      // UIを即座に更新
      setObjectives(newObjectives);

      // APIに順序更新を送信
      const orderedIds = newObjectives.map(obj => obj.id);
      console.log("順序更新:", orderedIds);


      toast.success("順序を更新しました");
    } catch (e) {
      const err = extractErrorMessage(e);
      console.error("順序更新失敗:", err);
      toast.error("順序更新に失敗しました", { description: err });
      // エラー時は元の状態に戻す
      refetchObjectives();
    } finally {
      resetDragState();
    }
  };

  // ドラッグ終了
  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    const row = target.closest('tr');
    if (row) {
      row.classList.remove('opacity-50');
    }
    resetDragState();
  };

  // ドラッグ状態リセット
  const resetDragState = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDragOverPosition(null);
  };

  if (isLoading) {
    return <Skeleton className="h-16 w-full" />;
  }


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2">#</th>
            <th className="px-3 py-2">オブジェクティブ</th>
            <th className="px-3 py-2">期限</th>
            <th className="px-3 py-2">ステータス</th>
            <th className="px-3 py-2">担当者</th>
            <th className="px-3 py-2">進捗</th>
            <th className="px-3 py-2">報告日</th>
            <th className="px-3 py-2">履歴</th>
          </tr>
        </thead>
        <tbody onDragOver={(e) => {
            // drop可能にする
            e.preventDefault();
          }}
          className="[&_tr.drag-over-top]:border-t-2 [&_tr.drag-over-bottom]:border-b-2"
        >
          {objectives.map((obj, idx) => (
            <ObjectiveRow
              key={obj.id}
              taskId={taskId}
              objective={obj}
              index={idx}
              onSaveNew={handleSaveNew}
              onUpdate={handleUpdate}
              // ドラッグ関連のprops
              isDragging={draggedIndex === idx}
              isDragOver={dragOverIndex === idx}
              dragOverPosition={dragOverPosition}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}              
            />
          ))}

          {/* 常に表示される新規入力行 */}
          <ObjectiveRow
            key={`new-${objectives.length}`}
            taskId={taskId}
            objective={null}
            index={objectives.length}
            onSaveNew={handleSaveNew}
            onUpdate={handleUpdate}
            // 新規行はドラッグ無効
            isDragging={false}
            isDragOver={false}
            dragOverPosition={null}
            onDragStart={() => {}}
            onDragOver={() => {}}
            onDragLeave={() => {}}
            onDrop={() => {}}
            onDragEnd={() => {}}            
          />
        </tbody>
      </table>
    </div>
  );
};

