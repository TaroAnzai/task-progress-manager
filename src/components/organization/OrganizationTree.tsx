import React, { useEffect, useState } from "react";
import {
  useGetTaskProgressOrganizations,
  useCreateTaskProgressOrganization,
} from "@/api/generated/taskProgressAPI";
import type {
  Organization,
  OrganizationInput,
} from "@/api/generated/taskProgressAPI.schemas";
import { useToast } from "@/components/ui/use-toast";
import { TreeNode } from "./TreeNode";

interface OrganizationTreeProps {
  companyCode: string;
  userContext: {
    hasAdminScope: () => boolean;
    scope?: string[];
  };
}

export const OrganizationTree: React.FC<OrganizationTreeProps> = ({
  companyCode,
  userContext,
}) => {
  const [parentCode, setParentCode] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const { toast } = useToast();

  // React Query で組織一覧取得
  const { data: orgs, refetch } = useGetTaskProgressOrganizations({
    query: { staleTime: 1000 * 60 }, // キャッシュ1分
  });

  const createOrgMutation = useCreateTaskProgressOrganization();

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
      if (o.parent_code && map[o.parent_code]) {
        map[o.parent_code].children.push(map[o.org_code]);
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
      toast({
        variant: "destructive",
        title: "エラー",
        description: "組織名とコードは必須です",
      });
      return;
    }
    const input: OrganizationInput = {
      name,
      org_code: code,
      parent_code: parentCode || null,
      company_code: companyCode,
    };
    try {
      await createOrgMutation.mutateAsync(input);
      toast({
        title: "登録成功",
        description: `${name} を追加しました`,
      });
      setName("");
      setCode("");
      setParentCode("");
      refetch();
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "登録失敗",
        description: e.message,
      });
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
            value={parentCode}
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
