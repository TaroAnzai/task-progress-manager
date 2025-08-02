import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Company } from "@/api/generated/taskProgressAPI.schemas";
import { Button } from "@/components/ui/button"
import { useGetProgressCompanies, useDeleteProgressCompaniesCompanyId } from "@/api/generated/taskProgressAPI";
import { useAlertDialog } from "@/context/AlertDialogContext"
import {extractErrorMessage} from "@/utils/errorHandler";


interface CompanySelectorDialogProps {
  open: boolean
  onClose: () => void
  onSelect: (company: Company) => void
}

export function CompanySelectorDialog({ open, onClose, onSelect }: CompanySelectorDialogProps) {
  const { data: companies, refetch} = useGetProgressCompanies()
  const { openAlertDialog } = useAlertDialog()
  const { mutate: deleteCompanyMutation, isPending: isDeleting} =useDeleteProgressCompaniesCompanyId({
    mutation: {
      onSuccess: () => {
        refetch();
      },
      onError: (error) => {
        const errorMessage = extractErrorMessage(error);
        console.error("Error deleting company:", errorMessage);
        openAlertDialog({
          title: "削除エラー",
          description: errorMessage || "会社の削除に失敗しました。",
        });
      }
    }
});

  const handleSelect = (company: Company) => {
    onSelect(company);
    onClose();
  };
  const handleDelete = async (companyId: number, companyName: string) => {
    openAlertDialog({
      title: "会社の削除",
      description: `「${companyName}」を削除してもよろしいですか？`,
      confirmText: "削除する",
      onConfirm: () => {
        deleteCompanyMutation({companyId});
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
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
            <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(company.id, company.name)}
                    disabled={isDeleting}
                  >
                    削除
            </Button>
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
  )
}
