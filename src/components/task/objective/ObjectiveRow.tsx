// src/components/task/ObjectiveRow.tsx
import { useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
    TableCell,
} from "@/components/ui/table"

import {
  getGetProgressUpdatesObjectiveIdQueryOptions,
  useDeleteProgressUpdatesProgressId,
  useGetProgressUpdatesObjectiveIdLatestProgress,
  usePostProgressUpdatesObjectiveId
} from "@/api/generated/taskProgressAPI";
import type { Objective, ObjectiveInput, ObjectiveUpdate, ObjectiveUpdateStatus as updateStatusType,ProgressInput } from "@/api/generated/taskProgressAPI.schemas";
import { ObjectiveStatus, ProgressStatus as StatusType } from "@/api/generated/taskProgressAPI.schemas";

import { useAlertDialog } from "@/context/useAlertDialog";

import { SingleUserSelectModal } from "../SingleUserSelectModal";
import { StatusBadgeCell } from "../StatusBadgeCell";

import { DateCell } from "./DateCell";
import { EditableCell } from "./EditableCell";
import { ProgressListModal } from "./ProgressListModal";

interface ObjectiveRowProps {
  taskId: number;
  objective: Objective | null;
  onSaveNew: (obj: ObjectiveInput) => Promise<void>;
  onUpdate: (objId: number, updates: ObjectiveUpdate) => Promise<void>;
}

export const ObjectiveRow = ({
  taskId,
  objective,
  onSaveNew,
  onUpdate,
}: ObjectiveRowProps) => {
  const qc = useQueryClient();
  const isNew = !objective;
  const [title, setTitle] = useState(objective?.title ?? "");
  const [dueDate, setDueDate] = useState(objective?.due_date ?? undefined);
  const [status, setStatus] = useState<StatusType>(objective?.status ?? ObjectiveStatus.UNDEFINED);
  const [isUserSelectModalOpen, setIsUserSelectModalOpen] = useState(false);
  const [isProgressListModalOpen, setIsProgressListModalOpen] = useState(false);
  const { openAlertDialog } = useAlertDialog();
  const { data, refetch: refetchLatestProgress } = useGetProgressUpdatesObjectiveIdLatestProgress(
    objective?.id ?? 0,
    { query: { enabled: !!objective, } }
  )
  const latest_progress = data?.detail ?? "";
  const latest_report_date = data?.report_date ?? "";
  const { mutate: postProgressMutation } = usePostProgressUpdatesObjectiveId(
    {
      mutation: {
        onSuccess: (_data, variables) => {
          toast.success("進捗を更新しました");
          refetchLatestProgress();
          const { queryKey } =
            getGetProgressUpdatesObjectiveIdQueryOptions(variables.objectiveId, {});
          qc.invalidateQueries({ queryKey });
        },
        onError: () => {
          openAlertDialog({
            title: "進捗登録失敗",
            description: "このデータを削除してもよろしいですか？",
            showCancel: false
          });
        }
      }
    })
  //進捗削除
  const { mutate: deleteProgressMutation } = useDeleteProgressUpdatesProgressId(
    {
      mutation: {
        onSuccess: () => {
          toast.success("進捗を削除しました");
          refetchLatestProgress();
          if (objective) {
            const { queryKey } = getGetProgressUpdatesObjectiveIdQueryOptions(objective.id, {});
            qc.invalidateQueries({ queryKey });
          }
        },
        onError: () => {
          openAlertDialog({
            title: "進捗登録失敗",
            description: "このデータを削除してもよろしいですか？",
            showCancel: false
          });
        }
      }
    })
  const handleTitleSave = (newTitle: string) => {
    setTitle(newTitle);
    if (isNew) {
      onSaveNew({ task_id: taskId, title: newTitle, due_date: dueDate });
    } else if (objective) {
      onUpdate(objective.id, { title: newTitle });
    }
  };

  const handleDateSave = (newDate: string | undefined) => {
    setDueDate(newDate);
    if (objective) {
      onUpdate(objective.id, { due_date: newDate });
    }
  };
  const handleStatusSave = (newStatus: updateStatusType) => {
    const status = newStatus ?? StatusType.UNDEFINED;
    setStatus(status);
    if (objective) {
      onUpdate(objective.id, { status: newStatus });
    }
  };
  const handleAssinedUserSave = (newUserId: number) => {
    if (objective) {
      onUpdate(objective.id, { assigned_user_id: newUserId });
    }
  };
  const handleProgressSave = (newProgress: string) => {
    if (newProgress === latest_progress || newProgress === "") {
      return false;
    }
    if (objective) {
      const data: ProgressInput = {
        detail: newProgress,
        report_date: new Date().toISOString()
      }
      postProgressMutation({ objectiveId: objective.id, data: data });
    }
  };
  const handleProgressDelete = (progressId: number) => {
    if (objective) {
      deleteProgressMutation({ progressId: progressId });
    }
  };
  useEffect(() => {
    if (objective) {
      setTitle(objective.title?? "");
      setDueDate(objective.due_date?? undefined);
      setStatus(objective.status);
    }
  }, [objective]);
  if (isNew) {
    return (
      <>
          <TableCell className="w-8 px-2 py-2 select-none">
          </TableCell>
          <TableCell className="px-3 py-2">
            <EditableCell value={""} onSave={handleTitleSave} />
          </TableCell>
      </>
    );
  } else {
    return (
      <>
          <TableCell className="px-3 py-2">
            <EditableCell  value={title} onSave={handleTitleSave} />
          </TableCell>
          <TableCell className="px-3 py-2">
            <DateCell value={dueDate} onSave={handleDateSave} />
          </TableCell>
          <TableCell className="px-3 py-2">
            <StatusBadgeCell value={status} onChange={handleStatusSave} />
          </TableCell>
          <TableCell
            className="px-3 py-2 cursor-pointer hover:bg-muted/30"
            onClick={() => setIsUserSelectModalOpen(true)}
          >
            {objective?.assigned_user_name ?? "-"}
          </TableCell>
          <TableCell className="px-3 py-2">
            <EditableCell value={latest_progress} onSave={handleProgressSave} />
          </TableCell>
          <TableCell className="px-3 py-2">{latest_report_date}</TableCell>
          <TableCell className="px-3 py-2">
            <button className="text-blue-600 hover:underline text-xs"
              onClick={() => setIsProgressListModalOpen(true)}
            >履歴</button>
          </TableCell>

        <SingleUserSelectModal
          taskId={taskId}
          open={isUserSelectModalOpen}
          onClose={() => setIsUserSelectModalOpen(false)}
          onConfirm={(newUserId) => {
            handleAssinedUserSave(newUserId.id);
          }}
        />
        {objective && (
          <ProgressListModal
            open={isProgressListModalOpen}
            objective={objective}
            onClose={() => { setIsProgressListModalOpen(false); }}
            onDelete={(objective_id) => { handleProgressDelete(objective_id) }}
          />
        )}
      </>
    );
  }

};

