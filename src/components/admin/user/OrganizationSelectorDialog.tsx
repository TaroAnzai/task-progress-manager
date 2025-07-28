// src/components/admin/user/OrganizationSelectorDialog.tsx

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGetProgressOrganizationsTree } from '@/api/generated/taskProgressAPI';
import type { OrganizationTreeNode } from '@/api/generated/taskProgressAPI.schemas';
import type { OrganizationSelectResult } from './types';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (org: OrganizationSelectResult) => void;
}

const OrganizationSelectorDialog: React.FC<Props> = ({ open, onClose, onSelect }) => {
  const { data: treeData, isLoading, error } = useGetProgressOrganizationsTree();

  const handleClick = (node: OrganizationTreeNode) => {
    onSelect({ org_code: node.org_code, org_name: node.name });
  };

  const renderTree = (nodes: OrganizationTreeNode[]) => (
    <ul className="ml-4 space-y-1">
      {nodes.map(node => (
        <li key={node.org_code}>
          <Button
            variant="ghost"
            size="sm"
            className="text-left p-1 hover:bg-muted/30"
            onClick={() => handleClick(node)}
          >
            {node.name} ({node.org_code})
          </Button>
          {node.children && node.children.length > 0 && renderTree(node.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>組織を選択</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          {isLoading && <p>読み込み中...</p>}
          {error && <p className="text-red-600">組織の取得に失敗しました</p>}
          {treeData && renderTree(treeData)}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationSelectorDialog;
