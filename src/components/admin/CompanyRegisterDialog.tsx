import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useAlertDialog } from "@/context/AlertDialogContext"
import { extractErrorMessage } from "@/utils/errorHandler" 
import { useGetProgressCompanies, usePostProgressCompanies } from "@/api/generated/taskProgressAPI";
import type { CompanyInput } from "@/api/generated/taskProgressAPI.schemas";

interface CompanyRegisterDialogProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function CompanyRegisterDialog({ open, onClose, onSuccess }: CompanyRegisterDialogProps) {
  const [name, setName] = useState("")
  const [rootOrgName, setRootOrgName] = useState("")
  const [systemAdminName, setSystemAdminName] = useState("")
  const [systemAdminEmail, setSystemAdminEmail] = useState("")
  const { refetch } = useGetProgressCompanies() 
  const [submitting, setSubmitting] = useState(false)
  const createCompanyMutation = usePostProgressCompanies()
  const { openAlertDialog } = useAlertDialog()

  const handleSubmit = async () => {
    if (!name.trim()) return;
    const payload: CompanyInput = { name: name.trim() };
    createCompanyMutation.mutate({ data: payload },
      {
        onSuccess: () => {
          refetch(); // 会社一覧を再取得""
          setName(""); // 入力フィールドをクリア
          onClose();
        },
        onError: (error) => {
          const errorMessage = extractErrorMessage(error);
          openAlertDialog({
            title: "登録エラー",
            description: errorMessage || "会社の登録に失敗しました。",
            showCancel: false,
          });
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>会社を登録</DialogTitle>
          <DialogDescription>
            新しい会社を登録してください。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="会社名を入力"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className="text-sm text-gray-500"> ルート組織の会社名を入力してください。</p>
          <Input
            type="text"
            placeholder="ルート組織の会社名を入力"
            value={rootOrgName}
            onChange={(e) => setRootOrgName(e.target.value)}
          />
          <p className="text-sm text-gray-500">組織の管理者を入力してください。</p>
          <Input
            type="text"
            placeholder="組織の管理者名を入力"
            value={systemAdminName}
            onChange={(e) => setSystemAdminName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="組織の管理者メールアドレスを入力"
            value={systemAdminEmail}
            onChange={(e) => setSystemAdminEmail(e.target.value)}
          />
        </div>
        <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={submitting}>
              登録
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
