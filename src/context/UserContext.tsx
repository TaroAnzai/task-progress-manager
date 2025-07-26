import { createContext, useContext, useState, useEffect } from "react";
import type{ ReactNode } from "react";
import { useGetProgressSessionsCurrent } from "@/api/generated/taskProgressAPI.ts";
import type { User } from "@/api/generated/taskProgressAPI.schemas.ts";

// Contextが提供する型（現状方針に沿って最小限に）
interface UserContextType {
  user: User | null;                  // 現在ログイン中のユーザー情報
  isLoading: boolean;                 // ユーザー情報取得中フラグ
  refetchUser: () => void;            // ユーザー情報再取得
  scopes: string[];                    // ログインユーザーのロール一覧
  hasAdminScope: () => boolean;       // 管理者権限を持つか
  hasSystemAdminScope: () => boolean; // システム管理者か
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: sessionData,
    isLoading,
    refetch,
  } = useGetProgressSessionsCurrent();

  const [user, setUser] = useState<User | null>(null);
  const [scopes, setScope] = useState<string[]>([]);

  // ユーザー情報更新
  useEffect(() => {
    if (sessionData) {
      const userData = (sessionData as any).data ?? sessionData; // AxiosResponse対応
      setUser(userData);
      setScope(userData.scope || []); // APIレスポンスに合わせて
    }
  }, [sessionData]);

  const hasAdminScope = () =>
    scopes.includes("system_admin") || scopes.includes("admin");

  const hasSystemAdminScope = () => scopes.includes("system_admin");

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
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
