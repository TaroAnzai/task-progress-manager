import { createContext, useContext, useState, useEffect } from "react";
import type{ ReactNode } from "react";
import { useGetProgressSessionsCurrent } from "@/api/generated/taskProgressAPI.ts";
import type { User } from "@/api/generated/taskProgressAPI.schemas.ts";

// Contextが提供する型（現状方針に沿って最小限に）
interface UserContextType {
  user: User | null;                 // 現在ログイン中のユーザー情報
  loading: boolean;                 // ユーザー情報取得中フラグ
  refetchUser: () => void;            // ユーザー情報再取得
  scopes: string[];                    // ログインユーザーのロール一覧
  hasAdminScope: () => boolean;       // 管理者権限を持つか
  hasSystemAdminScope: () => boolean; // システム管理者か
}

const UserContext = createContext<UserContextType>({
   user: null,
   loading: true,
   scopes: [],
   hasAdminScope: () => false,
   hasSystemAdminScope: () => false,
   refetchUser: () => {}
 });

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: sessionData,
    isLoading: queryLoading,
    isFetching,
    isSuccess,
    refetch,
  } = useGetProgressSessionsCurrent();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // ✅ 完全確定までtrue
  const [scopes, setScopes] = useState<string[]>([]);

  // ユーザー情報更新
  useEffect(() => {
    // ✅ isSuccessで結果確定後にのみユーザー情報を更新
    if (!queryLoading && !isFetching && isSuccess) {
      if (sessionData && (sessionData as any).id) {
        const userData = (sessionData as any).data ?? sessionData;
        setUser(userData);
        setScopes(userData.scope || []);
      } else {
        setUser(null);
        setScopes([]);
      }
      setLoading(false); // ✅ 完全確定
    }
  }, [queryLoading, isFetching, isSuccess, sessionData]);

  const hasAdminScope = () =>
    user?.is_superuser || scopes.includes("system_admin") || scopes.includes("admin") ;

  const hasSystemAdminScope = () => scopes.includes("system_admin");

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        refetchUser: refetch,
        scopes,
        hasAdminScope,
        hasSystemAdminScope,
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
