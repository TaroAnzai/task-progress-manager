// src/components/task/taskSettingModal/hooks/useTaskEditModal.ts

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import {
  usePutProgressTasksTaskId,
  useGetProgressObjectivesTasksTaskId,
  useDeleteProgressObjectivesObjectiveId,
  useGetProgressTasksTaskIdAuthorizedUsers,
  useGetProgressTasksTaskIdAccessUsers,
  useGetProgressTasksTaskIdAccessOrganizations,
  usePutProgressTasksTaskIdAccessLevels,
} from "@/api/generated/taskProgressAPI";
import type {
  Task,
  Objective,
  AccessLevelInput,
  AccessUser,
  OrgAccess,
} from "@/api/generated/taskProgressAPI.schemas";

export function useTaskEditModal(task: Task, onClose: () => void) {
  const { user } = useUser();

  const [formState, setFormState] = useState({
    title: task.title || "",
    description: task.description || "",
    due_date: task.due_date || "",
  });

  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [scopeUsers, setScopeUsers] = useState<AccessUser[]>([]);
  const [scopeOrgs, setScopeOrgs] = useState<OrgAccess[]>([]);
  const [isEditable, setIsEditable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateTask = usePutProgressTasksTaskId();
  const { data: objData } = useGetProgressObjectivesTasksTaskId(task.id);
  const { data:authorized_users} = useGetProgressTasksTaskIdAuthorizedUsers(task.id);
  const { data: userScopes } = useGetProgressTasksTaskIdAccessUsers(task.id);
  const { data: orgScopes } = useGetProgressTasksTaskIdAccessOrganizations(task.id);

  useEffect(() => {
    const editable = (authorized_users ?? []).some((u) => u.user_id === user?.id);
    setIsEditable(editable);
  }, [user, task, authorized_users]);

  useEffect(() => {
    if (objData?.objectives) setObjectives(objData.objectives);
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
        },
      });

      const userAccess = scopeUsers.map(u => ({
        user_id: u.user_id,
        access_level: u.access_level || "view",
      }));
      const orgAccess = scopeOrgs.map(o => ({
        organization_id: o.organization_id,
        access_level: o.access_level || "view",
      }));

      const updateAccess = usePutProgressTasksTaskIdAccessLevels();
      await updateAccess.mutateAsync({
        taskId: task.id,
        data: { user_access:userAccess, organization_access:orgAccess } as AccessLevelInput,
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

  const handleAddUser = (user: AccessUser) => {
    if (!scopeUsers.find(u => u.user_id === user.user_id)) {
      setScopeUsers(prev => [...prev, user]);
    }
  };

  const handleRemoveUser = (userId: number) => {
    setScopeUsers(prev => prev.filter(u => u.user_id !== userId));
  };

  const handleAddOrg = (org: OrgAccess) => {
    if (!scopeOrgs.find(o => o.organization_id === org.organization_id)) {
      setScopeOrgs(prev => [...prev, org]);
    }
  };

  const handleRemoveOrg = (organization_id: number) => {
    setScopeOrgs(prev => prev.filter(o => o.organization_id !== organization_id));
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
