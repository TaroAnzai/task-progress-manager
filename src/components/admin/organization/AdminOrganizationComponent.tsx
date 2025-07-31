import React, {useEffect, useState} from "react";
import { OrganizationTreeView } from "./OrganizationTreeView";
import  BulkTextInputForm  from "../import/BulkTextInputForm"
import { useBulkOrganizationRegister } from "../import/useBulkOrganizationRegister";
import { ReusableAlertDialog } from "@/components/utils/ReusableAlertDialog";

/**
 * 外部からは <TreeView companyId={...} /> で使用する
 */
interface TreeViewProps {
  companyId: number;
}

export const AdminOrganizationComponent: React.FC<TreeViewProps> = ({ companyId }) => {
  const { registerFromLines, loading, errors } = useBulkOrganizationRegister(companyId)
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (errors.length > 0) {
      setDialogOpen(true);
    }
  },[errors])
  return (
    <>
    <OrganizationTreeView
      companyId={companyId}
    />
    <BulkTextInputForm
     title="組織の一括登録"
      placeholder="
      組織名, 組織コード, 親組織コード
      商品部, dev01, root"
      onSubmit={registerFromLines}
      loading={loading}
    />
    <ReusableAlertDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      title="登録エラー"
      description={errors.join("\n")}
      onConfirm={() => setDialogOpen(false)}
      showCancel={false}
    />

    </>
      
  );
};
