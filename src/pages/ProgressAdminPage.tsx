import { use, useEffect, useState } from "react";
import { UserProvider, useUser } from "@/context/UserContext";
import { useNavigate, useLocation } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import { CompanySelectorDialog } from "@/components/admin/CompanySelectorDialog";
import {useGetProgressOrganizationsOrgId, useGetProgressCompaniesCompanyId} from "@/api/generated/taskProgressAPI";
import type { Company } from "@/api/generated/taskProgressAPI.schemas";
import { AdminOrganizationComponent } from "@/components/admin/organization/AdminOrganizationComponent";
import AdminUserComponent from "@/components/admin/user/AdminUserComponent";

const AdminPageContent = () => {
  const { user, loading, hasAdminScope, getUserRole } = useUser();
  const navigate = useNavigate(); // ← ★追加
  const location = useLocation(); // 現在のパスを取得するために必要
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const companyId = user?.company_id ?? null;

  const { data: companyData } = useGetProgressCompaniesCompanyId(companyId ?? 0,undefined, {
    query: {
      enabled: !!companyId,
    },
  });

  useEffect(() => {
    if (companyData) {
      setSelectedCompany(companyData);
    }
  }, [companyData]);
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
      <p className="font-bold text-lg mb-4">👤 {user.name} (ID: {user.id}) organization:( {user.organization_name}) 
      権限:({String(getUserRole())})
      </p>
      {hasAdminScope() ? (
        <>
          {user.is_superuser && (
            <div className="space-y-6">
                <div className="p-4 border rounded bg-white shadow">
                    <Button onClick={() => setDialogOpen(true)}>会社を選択</Button>
                    <Button onClick={() => setSelectedCompany(null)}>会社選択解除</Button>
                    {selectedCompany && <p>選択中: {selectedCompany.name}</p>}
                </div>
            </div>
          )}

          {selectedCompany  || user.is_superuser ? (
          <>
            <div className="space-y-6">
              <div className="p-4 border rounded bg-white shadow">
                <div className="mt-4 space-y-2">
                  <AdminOrganizationComponent companyId={selectedCompany?.id!} />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-4 border rounded bg-white shadow">
                <div className="mt-4 space-y-2">
                  <AdminUserComponent companyId={selectedCompany?.id!} />
                </div>
              </div>
            </div>
          </>
          ):(
            <p className="text-red-600 font-bold">⚠ 会社を選択してください。</p>
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
