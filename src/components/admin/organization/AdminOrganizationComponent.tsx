import React from "react";
import { OrganizationTreeView } from "./OrganizationTreeView";
import  BulkTextInputForm  from "../import/BulkTextInputForm"
import { useBulkOrganizationRegister } from "../import/useBulkOrganizationRegister";

/**
 * 外部からは <TreeView companyId={...} /> で使用する
 */
interface TreeViewProps {
  companyId: number;
}
const { registerFromLines, loading } = useBulkOrganizationRegister()
export const AdminOrganizationComponent: React.FC<TreeViewProps> = ({ companyId }) => {
  return (
    <>
    <OrganizationTreeView
      companyId={companyId}
    >
    </OrganizationTreeView>
    <BulkTextInputForm
     title="組織の一括登録"
      placeholder="組織名, 組織コード, 親組織コード\n商品部, dev01, root"
      onSubmit={registerFromLines}
      loading={loading}
      
    >
    </BulkTextInputForm>
    </>
      
  );
};
