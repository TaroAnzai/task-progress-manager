// src/components/task/taskSettingModal/ScopeSection.tsx

import { Plus, X } from "lucide-react";

import type {
  AccessUser,
  OrgAccess,
} from "@/api/generated/taskProgressAPI.schemas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ScopeSectionProps {
  isEditable: boolean;
  users: AccessUser[];
  orgs: OrgAccess[];
  onAddUser: (user: AccessUser) => void;
  onRemoveUser: (userId: number) => void;
  onAddOrg: (org: OrgAccess) => void;
  onRemoveOrg: (orgId: number) => void;
}

export function ScopeSection({
    isEditable,
    users,
    orgs,

  }: ScopeSectionProps) {


  return (
    <div className="mt-6 space-y-4">
      <div>
        <h3 className="text-base font-semibold mb-1">ユーザースコープ</h3>
        <div className="flex flex-wrap gap-2">
          {users.map((user) => (
            <Badge
              key={user.user_id}
              className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1"
            >
              {user.name}
              {isEditable && (
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => {}}
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
          {orgs.map((org) => (
            <Badge
              key={org.organization_id}
              className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1"
            >
              {org.name}
              {isEditable && (
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => {}}
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
  );
}
