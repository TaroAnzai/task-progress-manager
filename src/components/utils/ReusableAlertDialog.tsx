import { useEffect } from "react"
import type { ReactNode } from "react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  descriptionNode?: ReactNode
  onConfirm?: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
}

export function ReusableAlertDialog({
  open,
  onOpenChange,
  title,
  description,
  descriptionNode,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "キャンセル",
  showCancel = true,
}: Props) {
  // ダイアログが開く際にフォーカス管理
  useEffect(() => {
    if (open) {
      // ダイアログが開く前にアクティブな要素のフォーカスをクリア
      if (document.activeElement && document.activeElement !== document.body) {
        (document.activeElement as HTMLElement).blur();
      }
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // フォーカスをクリアしてからダイアログを閉じる
      setTimeout(() => {
        document.body.focus();
      }, 0);
    }
    onOpenChange(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent
            onEscapeKeyDown={() => {
            onCancel?.();
            handleOpenChange(false);
            }}
        >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="whitespace-pre-wrap">
              {description}
            </AlertDialogDescription>
          )}
          {descriptionNode}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {showCancel && (
            <AlertDialogCancel onClick={() => {
              onCancel?.()
              handleOpenChange(false)
            }}>
              {cancelText}
            </AlertDialogCancel>
          )}
          <AlertDialogAction onClick={() => {
            onConfirm?.()
            handleOpenChange(false)
          }}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}