import { createContext, useContext, useState, useEffect } from "react";
import type{ ReactNode } from "react";
import { useGetProgressSessionsCurrent } from "@/api/generated/taskProgressAPI.ts";
import type { UserWithScopes } from "@/api/generated/taskProgressAPI.schemas.ts";
import  {  AccessScopeRole } from "@/api/generated/taskProgressAPI.schemas.ts";
// Contextが提供する型（現状方針に沿って最小限に）
interface UserContextType {
  user: UserWithScopes | null;                 // 現在ログイン中のユーザー情報
  loading: boolean;                 // ユーザー情報取得中フラグ
  refetchUser: () => void;            // ユーザー情報再取得
  hasAdminScope: () => boolean | undefined;       // 管理者権限を持つか
  hasSystemAdminScope: () => boolean | undefined; // システム管理者か
  getUserRole: () => string; 
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refetchUser: () => {},
  hasAdminScope: () => false,
  hasSystemAdminScope: () => false,
  getUserRole: () => "",
 });

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: sessionData,
    isLoading: queryLoading,
    isFetching,
    isSuccess,
    refetch,
  } = useGetProgressSessionsCurrent();

  const [user, setUser] = useState<UserWithScopes | null>(null);
  const [loading, setLoading] = useState(true); // ✅ 完全確定までtrue

  // ユーザー情報更新
  useEffect(() => {
    // ✅ isSuccessで結果確定後にのみユーザー情報を更新
    if (!queryLoading && !isFetching && isSuccess) {
      if (sessionData && (sessionData as any).id) {
        const userData = (sessionData as any).data ?? sessionData;
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false); // ✅ 完全確定
    }
  }, [queryLoading, isFetching, isSuccess, sessionData]);

  const hasAdminScope = () => {
    if (user?.is_superuser) return true;
    return user?.access_scopes?.some(scope=>
      scope.role === AccessScopeRole.SYSTEM_ADMIN || AccessScopeRole.ORG_ADMIN
    );
  };

  const hasSystemAdminScope = () =>{
    return user?.access_scopes?.some(scope => scope.role === AccessScopeRole.SYSTEM_ADMIN);
  } 
  const getUserRole = (): string => {
    if (user?.is_superuser) return "Superuser";
    if (hasSystemAdminScope()) return "system-admin";
    if (hasAdminScope()) return "organization-admin";
    return "";
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        refetchUser: refetch,
        hasAdminScope,
        hasSystemAdminScope,
        getUserRole, 
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
