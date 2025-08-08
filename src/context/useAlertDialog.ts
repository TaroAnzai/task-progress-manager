import { useContext } from "react";
import { AlertDialogContext, type DialogContextType } from "./AlertDialogContextBase";

export function useAlertDialog(): DialogContextType {
  const context = useContext(AlertDialogContext);
  if (!context) throw new Error("useAlertDialog must be used within an AlertDialogProvider");
  return context;
}
