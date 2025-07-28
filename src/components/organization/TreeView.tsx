import React from "react";
import { OrganizationTreeView } from "./OrganizationTreeView";

/**
 * 外部からは <TreeView companyId={...} /> で使用する
 */
interface TreeViewProps {
  companyId: number;
}

export const TreeView: React.FC<TreeViewProps> = ({ companyId }) => {
  return (
    <OrganizationTreeView
      companyId={companyId}
    />
  );
};
