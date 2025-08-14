//src\components\task\taskSettingOrderModal\TaskOrderSettingModal.tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { useTasks } from "@/context/useTasks"
interface TaskSettingModalProps {
    open: boolean;
    onClose: () => void;
    onDelete: (id: number) => void
}

export const TaskOrderSettingModal = ({ open, onClose, onDelete }: TaskSettingModalProps) => {
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
                            <TableHead className="w-[100px]">タスク名</TableHead>
                            <TableHead>作成者</TableHead>
                            <TableHead>期限</TableHead>
                            <TableHead>ステータス</TableHead>
                            <TableHead>アクセス権限</TableHead>                            
                            <TableHead className="text-right">削除</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks?.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell className="font-medium">{task.title}</TableCell>
                                <TableCell>{task.due_date}</TableCell>
                                <TableCell>{task.create_user_name}</TableCell>
                                <TableCell>{task.status}</TableCell>
                                <TableCell>{task.user_access_level}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="destructive" size="sm" onClick={() => onDelete(task.id)}>削除</Button>
                                </TableCell>
                            </TableRow>
                        ))
                        }
                    </TableBody>

                </Table>

            <DialogFooter>
                <Button onClick={onClose}>閉じる</Button>
            </DialogFooter>
        </DialogContent>
        </Dialog >
    );
};