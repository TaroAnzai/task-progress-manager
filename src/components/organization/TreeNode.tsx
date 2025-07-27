import React, { useState } from "react";
import { toast } from "sonner";
import type { Organization, OrganizationInput } from "@/api/generated/taskProgressAPI.schemas";
import {
  useDeleteProgressOrganizationsOrgId,
  usePutProgressOrganizationsOrgId,
  usePostProgressOrganizations,
} from "@/api/generated/taskProgressAPI";

interface TreeNodeProps {
  node: Organization & { children?: Organization[] };
  onRefresh: () => void;
}

export const TreeNode: React.FC<TreeNodeProps> = ({ node, onRefresh }) => {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [childName, setChildName] = useState("");
  const [childCode, setChildCode] = useState("");

  const deleteOrgMutation = useDeleteProgressOrganizationsOrgId();
  const updateParentMutation = usePutProgressOrganizationsOrgId();
  const createOrgMutation = usePostProgressOrganizations();

  const handleAddChild = async () => {
    if (!childName || !childCode) {
      toast.error("組織名とコードは必須です");
      return;
    }
 
    const input: OrganizationInput = {
          name: childName,
          org_code: childCode,
          parent_id: node.id,
          company_id: node.company_id,
    };
    try {
      await createOrgMutation.mutateAsync({data: input});
      toast.success("組織を登録しました");
      setAdding(false);
      setChildName("");
      setChildCode("");
      onRefresh();
    } catch (e: any) {
      console.error("登録失敗:", e);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`「${node.name}」を削除しますか？`)) return;
    try {
      await deleteOrgMutation.mutateAsync({ orgId: node.id!}); //!を取れるか
      toast.success(`${node.name} を削除しました`);
      onRefresh();
    } catch (e: any) {
      toast.error(`削除に失敗しました: ${e.message || "不明なエラー"}`);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const dragged = e.dataTransfer.getData("text/plain");
    if (dragged === node.org_code) return;
    
    const payload = {
      orgId: dragged,
      organizationUpdate:{parent_id:node.org_code}
    };
    try {
      await updateParentMutation.mutateAsync(payload);

      toast({
        title: "更新成功",
        description: "親組織を更新しました",
      });
      onRefresh();
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "更新失敗",
        description: e.message,
      });
    }
  };

  return (
    <li
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", node.org_code)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="pl-2"
    >
      <span
        className="cursor-pointer select-none"
        onClick={() => setOpen((o) => !o)}
      >
        {node.children && node.children.length > 0
          ? open
            ? "▼"
            : "▶"
          : "・"}
      </span>
      <span className="ml-1">{node.name} ({node.org_code})</span>
      <span className="ml-2 space-x-1">
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700"
        >
          ×
        </button>
        <button
          onClick={() => setAdding((a) => !a)}
          className="text-green-500 hover:text-green-700"
        >
          ＋
        </button>
      </span>

      {adding && (
        <div className="ml-4 mt-1 space-x-1">
          <input
            className="border rounded p-1"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="組織名"
          />
          <input
            className="border rounded p-1"
            value={childCode}
            onChange={(e) => setChildCode(e.target.value)}
            placeholder="組織コード"
          />
          <button
            onClick={handleAddChild}
            className="px-1 py-0.5 bg-blue-500 text-white rounded"
          >
            登録
          </button>
          <button
            onClick={() => setAdding(false)}
            className="px-1 py-0.5 bg-gray-300 rounded"
          >
            キャンセル
          </button>
        </div>
      )}

      {open && node.children && node.children.length > 0 && (
        <ul className="list-none pl-4">
          {node.children.map((c) => (
            <TreeNode key={c.org_code} node={c} onRefresh={onRefresh} />
          ))}
        </ul>
      )}
    </li>
  );
};
