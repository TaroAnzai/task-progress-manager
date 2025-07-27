import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useGetProgressCompanies,
  usePostProgressCompanies,
  useDeleteProgressCompaniesCompanyId,
} from "@/api/generated/taskProgressAPI.ts";
import type { Company, CompanyInput } from "@/api/generated/taskProgressAPI.schemas.ts";

interface CompanySelectorDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (company: Company) => void;
}

export const CompanySelectorDialog: React.FC<CompanySelectorDialogProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  const [newCompanyName, setNewCompanyName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  // 会社一覧取得
  const { data: companies, isLoading, refetch } = useGetProgressCompanies({
    query: {
      enabled: open,
    },
  });
  
  const { mutate: createCompany, isPending: isCreating } = usePostProgressCompanies({
    mutation: {
      onSuccess: () => {
        setNewCompanyName("");
        refetch();
      },
    },
  });

  const { mutate: deleteCompany, isPending: isDeleting } =
    useDeleteProgressCompaniesCompanyId({
      mutation: {
        onSuccess: () => {
          setDeleteTarget(null);
          setIsAlertDialogOpen(false);
          refetch();
        },
      },
    });

  const handleSelect = (company: Company) => {
    onSelect(company);
    onClose();
  };

  const handleCreate = () => {
    if (!newCompanyName.trim()) return;
    const payload: CompanyInput = { name: newCompanyName.trim() };
    createCompany({ data: payload });
  };

  const handleDeleteClick = (company: Company) => {
    setDeleteTarget(company);
    setIsAlertDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget?.id) return;
    deleteCompany({ companyId: deleteTarget.id });
  };

  const handleAlertDialogClose = () => {
    setDeleteTarget(null);
    setIsAlertDialogOpen(false);
  };

  return (
    <>
      {/* メインダイアログ - AlertDialogが開いている時は閉じる */}
      <Dialog open={open && !isAlertDialogOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>会社を選択</DialogTitle>
            <DialogDescription>
              リストから選択するか、新しい会社を登録してください。
            </DialogDescription>
          </DialogHeader>

          {/* 新規登録フォーム */}
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="会社名を入力"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
            />
            <Button
              onClick={handleCreate}
              disabled={isCreating || !newCompanyName.trim()}
            >
              {isCreating ? "登録中..." : "登録"}
            </Button>
          </div>

          {/* 会社一覧 */}
          {isLoading ? (
            <p className="text-center">読み込み中...</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {companies?.map((company) => (
                <div key={company.id} className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    className="flex-1 justify-start mr-2"
                    onClick={() => handleSelect(company)}
                  >
                    {company.name}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(company)}
                    disabled={isDeleting}
                  >
                    削除
                  </Button>
                </div>
              ))}
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={onClose}>
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog（削除確認用） */}
      <AlertDialog open={isAlertDialogOpen} onOpenChange={handleAlertDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>会社を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{deleteTarget?.name}」を削除すると元に戻せません。
              よろしいですか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleAlertDialogClose}>
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "削除中..." : "削除する"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};