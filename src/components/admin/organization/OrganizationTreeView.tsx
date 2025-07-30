import React, { use, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useGetProgressOrganizationsTree,
  usePostProgressOrganizations,
} from "@/api/generated/taskProgressAPI";
import type {
  OrganizationInput,
  OrganizationTree,
} from "@/api/generated/taskProgressAPI.schemas";
import { TreeNode } from "./TreeNode";
import { UserProvider, useUser } from "@/context/UserContext";
import { extractErrorMessage } from "@/utils/errorHandler";
interface OrganizationTreeProps {
  companyId: number;
}

export const OrganizationTreeView: React.FC<OrganizationTreeProps> = ({
  companyId,
}) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [parentCode, setParentCode] = useState("");
  const [codeToIdMap, setCodeToIdMap] = useState<Record<string, number>>({});
 
  // ✅ ツリー取得（ユーザー権限 & company_id に応じてフィルタ済み）
  const { data: orgs, refetch } = useGetProgressOrganizationsTree({
    company_id: companyId,
  });

  const createOrgMutation = usePostProgressOrganizations();

  // ✅ コード → ID マッピング作成
  useEffect(() => {
    console.log("再マッピング");
    if (!orgs) return;
    const newMap: Record<string, number> = {};

    const traverse = (nodes: OrganizationTree[]) => {
      nodes.forEach((node) => {
        if (node.org_code && node.id !== undefined) {
          newMap[node.org_code] = node.id;
        }
        if (node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };

    traverse(orgs);
    setCodeToIdMap(newMap);
  }, [orgs]);

  // ✅ フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) {
      toast.error("組織名とコードは必須です");
      return;
    }
    console.log("登録データ:", { name, code, parentCode, companyId });
    const parentId = parentCode ? codeToIdMap[parentCode] ?? null : null;
    console.log("登録データ後:", { name, code, parentCode, parentId,companyId });
    const input: OrganizationInput = {
      name,
      org_code: code,
      parent_id: parentId,
      company_id: companyId,
    };

    try {
      await createOrgMutation.mutateAsync({ data: input });
      toast.success("組織を登録しました");
      setName("");
      setCode("");
      setParentCode("");
      refetch();
    } catch (e: any) {
      console.error("登録エラー:", e);
      toast.error(`登録に失敗しました: ${extractErrorMessage(e)}`);
    }
  };

  if (!useUser().hasAdminScope()) {
    return (
      <p className="text-sm text-gray-500">
        このユーザーは組織管理の権限がありません
      </p>
    );
  }

  return (
    <div className="p-4">
      <p>組織ツリー（{companyId}）</p>
      {/* 登録フォーム（システム管理者のみ） */}
      {useUser().scopes?.includes("system_admin") || useUser().scopes?.includes("admin") || useUser().user?.is_superuser && (
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 mb-4 items-center flex-wrap"
        >
          <input
            className="border rounded p-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="組織名"
          />
          <input
            className="border rounded p-1"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="組織コード"
          />
          <input
            className="border rounded p-1"
            value={parentCode}
            onChange={(e) => setParentCode(e.target.value)}
            placeholder="親組織コード"
          />
          <button
            type="submit"
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            登録
          </button>
        </form>
      )}

      {/* 組織ツリー */}
      <ul className="list-none">
        {(orgs ?? []).map((node) => (
          <TreeNode
            key={node.org_code}
            node={node}
            onRefresh={refetch}
          />
        ))}
      </ul>
    </div>
  );
};
