//src\components\task\taskSettingOrderModal\TaskOrderSettingModal.tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type { Task } from "@/api/generated/taskProgressAPI.schemas";

import { useTasks } from "@/context/useTasks"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
interface TaskSettingModalProps {
    open: boolean;
    onClose: () => void;
}

export const TaskOrderSettingModal = ({ open, onClose }: TaskSettingModalProps) => {
    const { tasks } = useTasks();

    return (
        <Dialog open={open} onOpenChange={onClose} >
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col" >
                <DialogHeader className="flex-shrink-0" >
                    <DialogTitle>タスクの並び替え・削除 </DialogTitle>
                    < DialogDescription > ドラッグしてタスク並び替・削除ボタンで削除 </DialogDescription>
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
                                    <Button variant="destructive" size="sm" onClick={() => onDelete(update.id)}>削除</Button>
                                </TableCell>
                            </TableRow>
                        ))
                        }
                    </TableBody>

                </Table>
            </DialogFooter>
        </DialogContent>
        </Dialog >
    );
};