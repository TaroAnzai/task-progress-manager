// src/components/task/taskSettingModal/TaskSettingModal.tsx
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useGetProgressUpdatesObjectiveId } from '@/api/generated/taskProgressAPI';
import type { Objective } from '@/api/generated/taskProgressAPI.schemas';
import { useTasks } from '@/context/useTasks';
interface ProgressListModalProps {
  open: boolean;
  objective: Objective;
  onClose: () => void;
  onDelete: (id: number) => void;
}

export const ProgressListModal = ({
  open,
  objective,
  onClose,
  onDelete,
}: ProgressListModalProps) => {
  const { data } = useGetProgressUpdatesObjectiveId(objective?.id);
  const { can } = useTasks();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>進捗一覧</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">進捗</TableHead>
              <TableHead>登録者</TableHead>
              <TableHead>登録日</TableHead>
              <TableHead className="text-right">削除</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((update) => (
              <TableRow key={update.id}>
                <TableCell className="font-medium">{update.detail}</TableCell>
                <TableCell>{update.updated_by}</TableCell>
                <TableCell>{update.report_date}</TableCell>
                <TableCell className="text-right">
                  {can('progress.delete', objective) && (
                    <Button variant="destructive" size="sm" onClick={() => onDelete(update.id)}>
                      削除
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <DialogFooter>
          <Button onClick={onClose}>閉じる</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
