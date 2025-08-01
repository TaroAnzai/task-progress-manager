import React, {useEffect} from "react";
import { OrganizationTreeView } from "./OrganizationTreeView";
import  BulkTextInputForm  from "../import/BulkTextInputForm"
import { useBulkOrganizationRegister } from "../import/useBulkOrganizationRegister";
import { useDialog} from "@/context/AlertDialogContext.tsx"
import { Card, CardContent } from '@/components/ui/card';
/**
 * 外部からは <TreeView companyId={...} /> で使用する
 */
interface TreeViewProps {
  companyId: number;
}

export const AdminOrganizationComponent: React.FC<TreeViewProps> = ({ companyId }) => {
  const { registerFromLines:orgRegister, loading, errors } = useBulkOrganizationRegister(companyId)
  const { openDialog } = useDialog();

  useEffect(() => {
    if (errors.length > 0) {
      openDialog({
        title: "エラー",
        description: errors.join("\n"),
        confirmText: "閉じる",
        showCancel: false,
      });
    }
  },[errors])

  return (
    <>
    <Card>
      <CardContent>
        <OrganizationTreeView
          companyId={companyId}
        />
      </CardContent>
    </Card>
    <Card>
    <BulkTextInputForm
     title="組織の一括登録"
      placeholder="
      組織名, 組織コード, 親組織コード
      商品部, dev01, root"
      onSubmit={orgRegister}
      loading={loading}
    />
    </Card>
    </>
      
  );
};
