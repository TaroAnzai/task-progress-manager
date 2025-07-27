import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useGetProgressOrganizations,
  usePostProgressOrganizations,
} from "@/api/generated/taskProgressAPI";
import type {
  Organization,
  OrganizationInput,
} from "@/api/generated/taskProgressAPI.schemas";
import { TreeNode } from "./TreeNode";

interface OrganizationTreeProps {
  companyId: number;
  userContext: {
    hasAdminScope: () => boolean;
    scope?: string[];
  };
}

export const OrganizationTree: React.FC<OrganizationTreeProps> = ({
  companyId,
  userContext,
}) => {
  const [parentCode, setParentCode] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");


  // React Query で組織一覧取得
  const { data: orgs, refetch } = useGetProgressOrganizations({
    query: { staleTime: 1000 * 60 }, // キャッシュ1分
  });

  const createOrgMutation = usePostProgressOrganizations();

  const buildTree = (
    orgs: Organization[]
  ): (Organization & { children: Organization[] })[] => {
    const map: Record<
      string,
      Organization & { children: Organization[] }
    > = {};
    const roots: (Organization & { children: Organization[] })[] = [];
    orgs.forEach((o) => {
      map[o.org_code] = { ...o, children: [] };
    });
    orgs.forEach((o) => {
      if (o.parent_id && map[o.parent_id]) {
        map[o.parent_id].children.push(map[o.org_code]);
      } else {
        roots.push(map[o.org_code]);
      }
    });
    return roots;
  };

  const tree = orgs ? buildTree(orgs) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) {
      toast.error("組織名とコードは必須です");
      return;
    }
    const parentId = Number(parentCode) || null; //後で変換関数作成
    const input: OrganizationInput = {
      name,
      org_code: code,
      parent_id: parentId || null,
      company_id: companyId,
    };
    try {
      await createOrgMutation.mutateAsync({data:input});
      toast.success("組織を登録しました");
      setName("");
      setCode("");
      setParentCode("");
      refetch();
    } catch (e: any) {
      toast.error(`登録に失敗しました: ${e.message || "不明なエラー"}`);
    }
  };

  if (!userContext.hasAdminScope()) {
    return (
      <p className="text-sm text-gray-500">
        このユーザーは組織管理の権限がありません
      </p>
    );
  }

  return (
    <div className="p-4">
      {userContext.scope?.includes("system_admin") && (
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
            value={parentCode || ""}
            onChange={(e) => setParentCode(e.target.value)}
            placeholder="親コード"
          />
          <button
            type="submit"
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            登録
          </button>
        </form>
      )}
      <ul className="list-none">
        {tree.map((node) => (
          <TreeNode key={node.org_code} node={node} onRefresh={refetch} />
        ))}
      </ul>
    </div>
  );
};
