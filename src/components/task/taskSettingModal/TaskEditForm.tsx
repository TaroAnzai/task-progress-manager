// src/components/task/taskSettingModal/TaskEditForm.tsx

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ChangeEvent } from "react";

interface TaskEditFormProps {
  formState: {
    title: string;
    description: string;
    due_date: string;
  };
  isEditable: boolean;
  onChange: (key: string, value: string) => void;
}

export function TaskEditForm({ formState, isEditable, onChange }: TaskEditFormProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="space-y-4 py-2">
      <div>
        <Label htmlFor="title">タスク名</Label>
        <Input
          id="title"
          name="title"
          value={formState.title}
          onChange={handleInputChange}
          disabled={!isEditable}
        />
      </div>

      <div>
        <Label htmlFor="description">説明</Label>
        <Textarea
          id="description"
          name="description"
          value={formState.description}
          onChange={handleInputChange}
          disabled={!isEditable}
        />
      </div>

      <div>
        <Label htmlFor="due_date">締切日</Label>
        <Input
          id="due_date"
          name="due_date"
          type="date"
          value={formState.due_date || ""}
          onChange={handleInputChange}
          disabled={!isEditable}
        />
      </div>
    </div>
  );
}  


// src/components/task/taskSettingModal/hooks/useTaskEditModal.ts

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useTask } from "@/context/TaskContext";
import {
  useUpdateProgressTasksTaskId,
  useGetProgressTasksTaskIdObjectives,
  useDeleteProgressObjectivesObjectiveId,
  useGetTaskAccessUsers,
  useGetTaskAccessOrganizations,
  usePutTaskAccessAccessLevels,
} from "@/api/generated/taskProgressAPI";
import type {
  Task,
  Objective,
  AccessLevelUpdateRequest,
  AccessScopeUser,
  AccessScopeOrganization,
} from "@/api/generated/taskProgressAPI.schemas";

export function useTaskEditModal(task: Task, onClose: () => void) {
  const { user } = useUser();
  const { canEditTask } = useTask();

  const [formState, setFormState] = useState({
    title: task.title || "",
    description: task.description || "",
    due_date: task.due_date || "",
  });

  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [scopeUsers, setScopeUsers] = useState<AccessScopeUser[]>([]);
  const [scopeOrgs, setScopeOrgs] = useState<AccessScopeOrganization[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const isEditable = canEditTask(task.id);

  const updateTask = useUpdateProgressTasksTaskId();
  const { data: objData } = useGetProgressTasksTaskIdObjectives(task.id);
  const { data: userScopes } = useGetTaskAccessUsers(task.id);
  const { data: orgScopes } = useGetTaskAccessOrganizations(task.id);

  useEffect(() => {
    if (objData) setObjectives(objData);
  }, [objData]);

  useEffect(() => {
    if (userScopes) setScopeUsers(userScopes);
  }, [userScopes]);

  useEffect(() => {
    if (orgScopes) setScopeOrgs(orgScopes);
  }, [orgScopes]);

  const handleChange = (key: string, value: string) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formState.title.trim()) {
      alert("タスク名は必須です");
      return;
    }

    setIsSaving(true);
    try {
      await updateTask.mutateAsync({
        taskId: task.id,
        data: {
          title: formState.title,
          description: formState.description,
          due_date: formState.due_date,
          user_id: user.id!,
        },
      });

      const userAccess = scopeUsers.map(u => ({
        user_id: u.id,
        access_level: u.access_level || "view",
      }));
      const orgAccess = scopeOrgs.map(o => ({
        organization_code: o.org_code,
        access_level: o.access_level || "view",
      }));

      const updateAccess = usePutTaskAccessAccessLevels();
      await updateAccess.mutateAsync({
        data: { userAccess, orgAccess } as AccessLevelUpdateRequest,
      });

      onClose();
    } catch (err) {
      console.error("タスク保存失敗", err);
      alert("保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveObjective = async (objectiveId: number) => {
    const remove = useDeleteProgressObjectivesObjectiveId();
    try {
      await remove.mutateAsync({ objectiveId });
      setObjectives(prev => prev.filter(o => o.id !== objectiveId));
    } catch (err) {
      console.error("オブジェクティブ削除失敗", err);
    }
  };

  const handleAddUser = (user: AccessScopeUser) => {
    if (!scopeUsers.find(u => u.id === user.id)) {
      setScopeUsers(prev => [...prev, user]);
    }
  };

  const handleRemoveUser = (userId: number) => {
    setScopeUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleAddOrg = (org: AccessScopeOrganization) => {
    if (!scopeOrgs.find(o => o.org_code === org.org_code)) {
      setScopeOrgs(prev => [...prev, org]);
    }
  };

  const handleRemoveOrg = (orgCode: string) => {
    setScopeOrgs(prev => prev.filter(o => o.org_code !== orgCode));
  };

  return {
    formState,
    isEditable,
    handleChange,
    handleSave,
    isSaving,
    objectives,
    scopeUsers,
    scopeOrgs,
    handleAddUser,
    handleRemoveUser,
    handleAddOrg,
    handleRemoveOrg,
    handleRemoveObjective,
  };
}
