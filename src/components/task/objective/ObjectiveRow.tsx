// src/components/task/ObjectiveRow.tsx
import { useState } from "react";

import { ProgressStatus as StatusType, type Objective, type ObjectiveInput, type ObjectiveUpdate, type ObjectiveUpdateStatus as updateStatusType } from "@/api/generated/taskProgressAPI.schemas";
import { ObjectiveStatus } from "@/api/generated/taskProgressAPI.schemas";

import SingleUserSelectModal from "../SingleUserSelectModal";
import { StatusBadgeCell } from "../StatusBadgeCell";

import { DateCell } from "./DateCell";
import { EditableCell } from "./EditableCell";



type ObjectiveRowProps = {
  key: number | string;
  taskId: number;
  objective: Objective | null; // nullなら新規
  index: number;
  onSaveNew: (obj: ObjectiveInput) => void;
  onUpdate: (objId: number, obj: ObjectiveUpdate) => void;
};

export const ObjectiveRow = ({ taskId, objective, onSaveNew, onUpdate }: ObjectiveRowProps) => {
  const isNew = !objective;
  const [title, setTitle] = useState(objective?.title ?? "");
  const [dueDate, setDueDate] = useState(objective?.due_date ?? undefined);
  const [status, setStatus] = useState<StatusType>(objective?.status ?? ObjectiveStatus.UNDEFINED);
  const [isUserSelectModalOpen, setIsUserSelectModalOpen] = useState(false);

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

  return (
    <>
      <tr className="border-b">
        <td className="px-3 py-2">
          <EditableCell value={title} onSave={handleTitleSave} />
        </td>
        {!isNew && (
          <>
            <td className="px-3 py-2">
              <DateCell value={dueDate} onSave={handleDateSave} />
            </td>
            <td className="px-3 py-2">
              <StatusBadgeCell value={status} onChange={handleStatusSave} />
            </td>
            <td
              className="px-3 py-2 cursor-pointer hover:bg-muted/30"
              onClick={() => setIsUserSelectModalOpen(true)}
            >
              {objective?.assigned_user_name ?? "-"}
            </td>
            <td className="px-3 py-2">{objective?.latest_progress ?? "-"}</td>
            <td className="px-3 py-2">{objective?.latest_report_date ?? "-"}</td>
            <td className="px-3 py-2">
              <button className="text-blue-600 hover:underline text-xs">履歴</button>
            </td>
          </>
        )}
      </tr>
      <SingleUserSelectModal
        taskId={taskId}
        open={isUserSelectModalOpen}
        onClose={() => setIsUserSelectModalOpen(false)}
        onConfirm={(newUserId) => {
          handleAssinedUserSave(newUserId.id);
        }}
      />
    </>
  );
};

