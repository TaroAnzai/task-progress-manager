import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  useGetProgressSessionsCurrent,
  useGetProgressAccessScopesUsersUserId,
} from "@/api/generated/taskProgressAPI.ts";
import type { User, AccessScope as DtoAccessScope } from "@/api/generated/taskProgressAPI.schemas.ts";

// ✅ UI用に変換したAccessScope型（Context内だけで完結）
interface UiAccessScope {
  organization_code: string;
  role: "system_admin" | "admin" | "member";
}

// ✅ Contextが提供する型
interface UserContextType {
  user: User | null;
  isLoading: boolean;
  refetchUser: () => void;
  scope: string[];
  accessScopes: UiAccessScope[];
  hasAdminScope: () => boolean;
  hasSystemAdminScope: () => boolean;
  hasRoleInOrg: (role: string, orgCode: string) => boolean;
  getAccessibleOrgCodesByRole: (role: string) => string[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // ✅ ユーザー情報取得
  const {
    data: sessionData,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useGetProgressSessionsCurrent();

  const [user, setUser] = useState<User | null>(null);

  // ✅ ユーザーが確定した後にスコープ取得
  const {
    data: rawAccessScopes,
    isLoading: isScopeLoading,
  } = useGetProgressAccessScopesUsersUserId(user?.id ?? 0, {
    query: { enabled: !!user?.id }, // user.idが確定してから実行
  });

  const [scope, setScope] = useState<string[]>([]);
  const [accessScopes, setAccessScopes] = useState<UiAccessScope[]>([]);

  // ✅ DTO → UI型への変換関数（このファイル内で完結）
  const convertAccessScope = (dto: DtoAccessScope): UiAccessScope => {
    return {
      organization_code: mapOrganizationIdToCode(dto.organization_id),
      role: (dto.role as "system_admin" | "admin" | "member") ?? "member",
    };
  };

  // ✅ 組織ID→コード変換（簡易版）
  const mapOrganizationIdToCode = (orgId: number): string => {
    // 本来は組織テーブルのキャッシュなどから取得すべき
    // 暫定的にIDを文字列化
    return `ORG-${orgId}`;
  };

  // ✅ ユーザー情報更新
  useEffect(() => {
    if (sessionData) {
      const userData = (sessionData as any).data ?? sessionData;
      setUser(userData);
      setScope(userData.scope || []);
    }
  }, [sessionData]);

  // ✅ アクセススコープ更新
  useEffect(() => {
    if (rawAccessScopes) {
      const converted = rawAccessScopes.map(convertAccessScope);
      setAccessScopes(converted);
    }
  }, [rawAccessScopes]);

  // ✅ 権限判定系関数
  const hasAdminScope = () =>
    scope.includes("system_admin") || scope.includes("admin");

  const hasSystemAdminScope = () => scope.includes("system_admin");

  const hasRoleInOrg = (role: string, orgCode: string) =>
    accessScopes.some(
      (s) => s.organization_code === orgCode && s.role === role
    );

  const getAccessibleOrgCodesByRole = (role: string) =>
    accessScopes
      .filter((s) => s.role === role)
      .map((s) => s.organization_code);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading: isUserLoading || isScopeLoading,
        refetchUser,
        scope,
        accessScopes,
        hasAdminScope,
        hasSystemAdminScope,
        hasRoleInOrg,
        getAccessibleOrgCodesByRole,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
