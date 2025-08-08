// src/components/task/taskScopeModal/TaskScopeModal.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  useGetProgressTasksTaskIdAuthorizedUsers,
  useGetProgressTasksTaskIdAccessUsers,
  useGetProgressTasksTaskIdAccessOrganizations,
} from "@/api/generated/taskProgressAPI";
import type {
  Task,
  AccessUser,
  OrgAccess,
} from "@/api/generated/taskProgressAPI.schemas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/context/useUser";
import { Plus, X } from "lucide-react";
export interface TaskScopeModalProps {
  task: Task;
  open: boolean;
  onClose: () => void;
}

export function TaskScopeModal({ task, open, onClose }: TaskScopeModalProps) {
  const { user : currentUser } = useUser();
  const { data:authorized_users} = useGetProgressTasksTaskIdAuthorizedUsers(task.id);
  const { data: getUsers } = useGetProgressTasksTaskIdAccessUsers(task.id);
  const { data: getOrgs } = useGetProgressTasksTaskIdAccessOrganizations(task.id);

  const [isEditable, setIsEditable] = useState(false);
  const [scopeUsers, setScopeUsers] = useState<AccessUser[]>([]);
  const [scopeOrgs, setScopeOrgs] = useState<OrgAccess[]>([]);

  useEffect(() => {
    const editable = (authorized_users ?? []).some((u) => u.user_id === currentUser?.id);
    setIsEditable(editable);
  }, [currentUser, task, authorized_users]);
  useEffect(() => {
    if (getUsers) setScopeUsers(getUsers);
  }, [getUsers]);

  useEffect(() => {
    if (getOrgs) setScopeOrgs(getOrgs);
  }, [getOrgs]);

  const onRemoveUser = (user_id: number|undefined) => {console.log(user_id)};
  const onRemoveOrg = (organization_id: number|undefined) => {console.log(organization_id)};

  return (
      <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>"タスクスコープ設定"</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

    <div className="mt-6 space-y-4">
      <div>
        <h3 className="text-base font-semibold mb-1">ユーザースコープ</h3>
        <div className="flex flex-wrap gap-2">
          {scopeUsers.map((user) => (
            <Badge
              key={user.user_id}
              className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1"
            >
              {user.name}
              {isEditable && (
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => onRemoveUser(user.user_id)}
                />
              )}
            </Badge>
          ))}
          {isEditable && (
            <Button size="sm" variant="outline" onClick={()=>{}}>
              <Plus className="w-4 h-4 mr-1" /> 追加
            </Button>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-1">組織スコープ</h3>
        <div className="flex flex-wrap gap-2">
          {scopeOrgs.map((org) => (
            <Badge
              key={org.organization_id}
              className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1"
            >
              {org.name}
              {isEditable && (
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => onRemoveOrg(org.organization_id)}
                />
              )}
            </Badge>
          ))}
          {isEditable && (
            <Button size="sm" variant="outline" onClick={()=>{}}>
              <Plus className="w-4 h-4 mr-1" /> 追加
            </Button>
          )}
        </div>
      </div>
    </div>
      </DialogContent>
    </Dialog>
  )
}