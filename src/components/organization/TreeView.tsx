import React from "react";
import { OrgNode } from "./OrganizationTree";
import { TreeNode } from "./TreeNode";

interface TreeViewProps {
  nodes: OrgNode[];
  onRefresh: () => void;
}

export const TreeView: React.FC<TreeViewProps> = ({ nodes, onRefresh }) => {
  return (
    <ul style={{ listStyle: "none" }}>
      {nodes.map((n) => (
        <TreeNode key={n.org_code} node={n} onRefresh={onRefresh} />
      ))}
    </ul>
  );
};
