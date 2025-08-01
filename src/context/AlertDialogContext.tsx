// src/context/AlertDialogContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type DialogOptions = {
  title?: string;
  description?: string;
  descriptionNode?: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
};

type DialogContextType = {
  openDialog: (options: DialogOptions) => void;
};

const AlertDialogContext = createContext<DialogContextType | undefined>(undefined);

export const AlertDialogProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("確認");
  const [description, setDescription] = useState("");
  const [descriptionNode, setDescriptionNode] = useState<ReactNode>(null);
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});
  const [onCancel, setOnCancel] = useState<() => void>(() => {});
  const [confirmText, setConfirmText] = useState("OK");
  const [cancelText, setCancelText] = useState("キャンセル");
  const [showCancel, setShowCancel] = useState(true);

  const openDialog = ({
    title = "確認",
    description = "",
    descriptionNode = null,
    onConfirm,
    onCancel,
    confirmText = "OK",
    cancelText = "キャンセル",
    showCancel = true,
  }: DialogOptions) => {
    setTitle(title);
    setDescription(description);
    setDescriptionNode(descriptionNode);
    setOnConfirm(() => () => {
      onConfirm?.();
      setOpen(false);
    });
    setOnCancel(() => () => {
      onCancel?.();
      setOpen(false);
    });
    setConfirmText(confirmText);
    setCancelText(cancelText);
    setShowCancel(showCancel);
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
            // ダイアログが開く前にアクティブな要素のフォーカスをクリア
      if (document.activeElement && document.activeElement !== document.body) {
        (document.activeElement as HTMLElement).blur();
      }
    }
  }, [open]);
  return (
    <AlertDialogContext.Provider value={{ openDialog }}>
      {children}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
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
              <AlertDialogCancel onClick={onCancel}>
                {cancelText}
              </AlertDialogCancel>
            )}
            <AlertDialogAction onClick={onConfirm}>
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
};

export const useDialog = (): DialogContextType => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a AlertDialogProvider");
  }
  return context;
};
