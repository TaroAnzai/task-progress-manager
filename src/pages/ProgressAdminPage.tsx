import { useEffect, useState } from "react";
import { UserProvider, useUser } from "../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom"; 

const AdminPageContent = () => {
  const { user, loading, hasAdminScope } = useUser();
  console.log("AdminPage user:", user);
  const navigate = useNavigate(); // ← ★追加
  const location = useLocation(); // 現在のパスを取得するために必要
  useEffect(() => {
    if (loading) return; 
    if (!user){
      // 未ログイン時にログインページへ遷移
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [loading, user, navigate]);

    if (loading) {
        return <p className="text-gray-500">読み込み中...</p>;
    }
    if (!user) {
      // レンダリングせず、リダイレクトが完了するまで何も表示しない
      return null;
    }
  return (
    <div className="p-4">
      <p className="font-bold text-lg mb-4">👤 {user.name} (ID: {user.id})</p>

      {hasAdminScope() ? (
        <div className="space-y-6">
          {/* ✅ 後でOrganizationAdmin, UserAdminコンポーネントを追加予定 */}
          <div className="p-4 border rounded bg-white shadow">
            <p className="text-gray-700">管理者用コンテンツはここに表示されます。</p>
          </div>
        </div>
      ) : (
        <p className="text-red-600 font-bold">⚠ このページは管理者専用です。</p>
      )}
    </div>
  );
}

export default function ProgressAdminPage() {
  return (
    <UserProvider>
      <AdminPageContent />
    </UserProvider>
  );
}
