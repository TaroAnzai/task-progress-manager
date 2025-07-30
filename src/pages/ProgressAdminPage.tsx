import { useEffect, useState } from "react";
import { UserProvider, useUser } from "@/context/UserContext";
import { useNavigate, useLocation } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import { CompanySelectorDialog } from "@/components/admin/CompanySelectorDialog";
import type { Company } from "@/api/generated/taskProgressAPI.schemas";
import { TreeView } from "@/components/organization/TreeView";

const AdminPageContent = () => {
  const { user, loading, hasAdminScope } = useUser();
  const navigate = useNavigate(); // ← ★追加
  const location = useLocation(); // 現在のパスを取得するために必要
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    if (loading) return; 
    if (!user){
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [loading, user, navigate, location.pathname]);

    if (loading) {
        return <p className="text-gray-500">読み込み中...</p>;
    }
    if (!user) {
      // レンダリングせず、リダイレクトが完了するまで何も表示しない
      return null;
    }
  return (
    <div className="p-4">
      <p className="font-bold text-lg mb-4">👤 {user.name} (ID: {user.id}) organization:( {user.organization_name})</p>
      {hasAdminScope() ? (
        <>
          <div className="space-y-6">
              <div className="p-4 border rounded bg-white shadow">
                  <Button onClick={() => setDialogOpen(true)}>会社を選択</Button>
                  {selectedCompany && <p>選択中: {selectedCompany.name}</p>}
              </div>
          </div>
          {selectedCompany && (
            <>
            <div className="space-y-6">
              {/* ✅ 後でOrganizationAdmin, UserAdminコンポーネントを追加予定 */}
              <div className="p-4 border rounded bg-white shadow">
                <p className="text-gray-700">管理者用コンテンツはここに表示されます。</p>
                <div className="mt-4 space-y-2">
                  <TreeView companyId={selectedCompany.id!} />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {/* ✅ 後でOrganizationAdmin, UserAdminコンポーネントを追加予定 */}
              <div className="p-4 border rounded bg-white shadow">
                <p className="text-gray-700">管理者用コンテンツはここに表示されます。</p>
                <div className="mt-4 space-y-2">
                  <TreeView companyId={selectedCompany.id!} />
                </div>
              </div>
            </div>
            </>
          )}
        </>
      ) : (
        <p className="text-red-600 font-bold">⚠ このページは管理者専用です。</p>
      )}
      <CompanySelectorDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSelect={(company) => setSelectedCompany(company)}
      />
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
