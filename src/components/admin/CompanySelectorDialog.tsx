import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  useDeleteProgressCompaniesCompanyId,
  useGetProgressCompanies,
  usePostProgressCompaniesCompanyIdRestore,
} from '@/api/generated/taskProgressAPI';
import type { Company } from '@/api/generated/taskProgressAPI.schemas';

import { extractErrorMessage } from '@/utils/errorHandler';

import { useAlertDialog } from '@/context/useAlertDialog';

interface CompanySelectorDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (company: Company) => void;
}

export const CompanySelectorDialog = ({ open, onClose, onSelect }: CompanySelectorDialogProps) => {
  const { data: companies, refetch } = useGetProgressCompanies();
  const { openAlertDialog } = useAlertDialog();
  const { mutate: deleteCompanyMutation, isPending: isDeleting } =
    useDeleteProgressCompaniesCompanyId({
      mutation: {
        onSuccess: () => {
          toast.success('会社を削除しました');
          refetch();
        },
        onError: (error) => {
          const errorMessage = extractErrorMessage(error);
          console.error('Error deleting company:', errorMessage);
          openAlertDialog({
            title: '削除エラー',
            description: errorMessage || '会社の削除に失敗しました。',
          });
        },
      },
    });
  const { mutate: restoreCompaniyMutate, isPending: isRestoring } =
    usePostProgressCompaniesCompanyIdRestore({
      mutation: {
        onSuccess: () => {
          toast.success('会社を復元しました');
          refetch();
        },
        onError: (error) => {
          console.error('Error restoring company:', error);
          openAlertDialog({
            title: '復元エラー',
            description: error || '会社の復元に失敗しました。',
          });
        },
      },
    });

  const handleSelect = (company: Company) => {
    onSelect(company);
    onClose();
  };
  const handleRestore = (companyId: number) => {
    restoreCompaniyMutate({ companyId });
  };
  const handleDelete = async (companyId: number, companyName: string) => {
    openAlertDialog({
      title: '会社の削除',
      description: `「${companyName}」を削除してもよろしいですか？`,
      confirmText: '削除する',
      onConfirm: () => {
        deleteCompanyMutation({ companyId });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>会社を選択</DialogTitle>
          <DialogDescription>
            リストから選択するか、新しい会社を登録してください。
          </DialogDescription>
        </DialogHeader>
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
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(company.id, company.name)}
                  disabled={isDeleting || isRestoring || company.is_deleted}
                >
                  削除
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleRestore(company.id)}
                  disabled={isDeleting || isRestoring || !company.is_deleted}
                >
                  復活
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDelete(company.id, company.name, company.name)}
                  disabled={isDeleting || isRestoring || company.is_deleted}
                >
                  完全削除
                </Button>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
