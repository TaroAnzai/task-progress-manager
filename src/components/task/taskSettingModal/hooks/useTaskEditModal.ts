// src/components/task/taskSettingModal/hooks/useTaskEditModal.ts
import { useEffect, useState } from "react";

import { toast } from "sonner";

import {
  useDeleteProgressObjectivesObjectiveId,
  useGetProgressObjectivesTasksTaskId,
  useGetProgressTasksTaskIdAuthorizedUsers,
  usePutProgressTasksTaskId,
} from "@/api/generated/taskProgressAPI";
import type {
  Objective,
  Task,
} from "@/api/generated/taskProgressAPI.schemas";

import { extractErrorMessage } from "@/utils/errorHandler";

import {useTasks} from "@/context/useTasks"
import { useUser } from "@/context/useUser";

export function useTaskEditModal(task: Task, onClose: () => void) {
  const { user } = useUser();
  const {refetch} = useTasks();

  const [formState, setFormState] = useState({
    title: task.title || "",
    description: task.description || "",
    due_date: task.due_date || "",
  });

  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [isEditable, setIsEditable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateTask = usePutProgressTasksTaskId();
  const { data: objData } = useGetProgressObjectivesTasksTaskId(task.id);
  const { data: authorized_users } = useGetProgressTasksTaskIdAuthorizedUsers(task.id);



  const remove = useDeleteProgressObjectivesObjectiveId();

  useEffect(() => {
    const editable = (authorized_users ?? []).some((u) => u.user_id === user?.id);
    setIsEditable(editable);
  }, [user, task, authorized_users]);

  useEffect(() => {
    if (objData?.objectives) setObjectives(objData.objectives);
  }, [objData]);


  const handleChange = (key: string, value: string) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formState.title.trim()) {
      alert("タスク名は必須です");
      return;
    }
    const filteredData = Object.fromEntries(
      Object.entries({
        title: formState.title,
        description: formState.description,
        due_date: formState.due_date,
      }).filter(([, value]) => value != null && value !== "")
    );    
    setIsSaving(true);
    try {
      await updateTask.mutateAsync({
        taskId: task.id,
        data: filteredData,
      });
      onClose();
      refetch();
      toast.success("更新完了", { description: "タスクを更新しました" });
    } catch (e) {
      const err = extractErrorMessage(e);
      console.error("タスク保存失敗", err);
      alert(`保存に失敗しました:${err}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveObjective = async (objectiveId: number) => {

    try {
      await remove.mutateAsync({ objectiveId });
      setObjectives(prev => prev.filter(o => o.id !== objectiveId));
    } catch (err) {
      console.error("オブジェクティブ削除失敗", err);
    }
  };

  return {
    formState,
    isEditable,
    handleChange,
    handleSave,
    isSaving,
    objectives,
    handleRemoveObjective,
  };
}
