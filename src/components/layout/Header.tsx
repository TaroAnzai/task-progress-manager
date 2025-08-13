// src/components/layout/Header.tsx

import { useDeleteProgressSessionsCurrent } from "@/api/generated/taskProgressAPI";

import { useUser } from "@/context/useUser";

const Header = () => {
  const { user, refetchUser } = useUser();
  const isLoggedIn = !!user?.id;
  const deleteSessionMutation = useDeleteProgressSessionsCurrent();
  const handleLogout = async () => {
    try {
      await deleteSessionMutation.mutateAsync();
      refetchUser(); // ユーザー情報を更新（nullになる）
    } catch (error) {
      console.error("ログアウトに失敗しました", error);
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">進捗管理システム</h1>
      <nav className="flex gap-4">
        <a href="/" className="hover:underline">タスク一覧</a>
        <a href="/objectives" className="hover:underline">オブジェクティブ</a>
        <a href="/admin" className="hover:underline">設定</a>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="hover:underline text-left">
            ログアウト
          </button>
        ) : (
          <a href="/login" className="hover:underline">ログイン</a>
        )}
      </nav>
    </header>
  );
};

export default Header;
