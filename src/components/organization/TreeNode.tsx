import React, { useState } from "react";
import type { Organization } from "@/api/generated/taskProgressAPI.schemas";
import {
  useDeleteTaskProgressOrganization,
  useUpdateTaskProgressOrganizationParent,
  useCreateTaskProgressOrganization,
} from "@/api/generated/taskProgressAPI";
import { useToast } from "@/components/ui/use-toast";

interface TreeNodeProps {
  node: Organization & { children?: Organization[] };
  onRefresh: () => void;
}

export const TreeNode: React.FC<TreeNodeProps> = ({ node, onRefresh }) => {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [childName, setChildName] = useState("");
  const [childCode, setChildCode] = useState("");
  const { toast } = useToast();

  const deleteOrgMutation = useDeleteTaskProgressOrganization();
  const updateParentMutation = useUpdateTaskProgressOrganizationParent();
  const createOrgMutation = useCreateTaskProgressOrganization();

  const handleAddChild = async () => {
    if (!childName || !childCode) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: "組織名とコードは必須です",
      });
      return;
    }
    try {
      await createOrgMutation.mutateAsync({
        name: childName,
        org_code: childCode,
        parent_code: node.org_code,
        company_code: node.company_code,
      });
      toast({
        title: "登録成功",
        description: `${childName} を追加しました`,
      });
      setAdding(false);
      setChildName("");
      setChildCode("");
      onRefresh();
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "登録失敗",
        description: e.message,
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm(`「${node.name}」を削除しますか？`)) return;
    try {
      await deleteOrgMutation.mutateAsync(node.org_code);
      toast({
        title: "削除成功",
        description: `${node.name} を削除しました`,
      });
      onRefresh();
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "削除失敗",
        description: e.message,
      });
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const dragged = e.dataTransfer.getData("text/plain");
    if (dragged === node.org_code) return;

    try {
      await updateParentMutation.mutateAsync({
        org_code: dragged,
        new_parent_code: node.org_code,
      });
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
