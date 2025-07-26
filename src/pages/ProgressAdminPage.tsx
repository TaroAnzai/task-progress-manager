import { UserProvider, useUser } from "../context/UserContext";

const AdminPageContent = () => {
  const { user, isLoading, hasAdminScope } = useUser();

    if (isLoading) {
        return <p className="text-gray-500">読み込み中...</p>;
    }

  if (!user) {
    return (
      <div className="p-4">
        <p className="text-red-600 font-boldPending mb-2">⚠ ログインしてください。</p>
      </div>
    );
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
