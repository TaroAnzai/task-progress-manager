// src/components/admin/user/OrganizationSelectorDialog.tsx

import React from 'react';

import { useGetProgressOrganizationsTree } from '@/api/generated/taskProgressAPI';
import type { OrganizationTree } from '@/api/generated/taskProgressAPI.schemas';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type OrganizationSelectResult = { org_id: number, org_name: string;}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (org: OrganizationSelectResult) => void;
  companyId?: number;
  selectedOrgIds?: number[];
}

const OrganizationSelectorDialog: React.FC<Props> = ({ companyId, open, onClose, onSelect, selectedOrgIds }) => {
  const { data: treeData, isLoading, error } = useGetProgressOrganizationsTree({ company_id: companyId});

  const handleClick = (node: OrganizationTree) => {
    if(!node.org_code || !node.name) return;
    onSelect({org_id: node.id, org_name: node.name });
  };

  const renderTree = (nodes: OrganizationTree[]) => (
    <ul className="ml-4 space-y-1">
      {nodes.map(node => (
        <li key={node.org_code}>
          <Button
            variant="ghost"
            size="sm"
            className="text-left p-1 hover:bg-muted/30"
            onClick={() => handleClick(node)}
            disabled={selectedOrgIds?.includes(node.id)}
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
        <DialogDescription>
          組織を選択してください。選択後、登録フォームに反映されます。
        </DialogDescription>
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
