// src/components/task/ObjectiveRow.tsx
import { useState } from "react";
import { EditableCell } from "./EditableCell";
import { DateCell } from "./DateCell";
import type { Objective,ObjectiveInput, ObjectiveUpdate } from "@/api/generated/taskProgressAPI.schemas";

type ObjectiveRowProps = {
  key: number | string;
  taskId: number;
  objective: Objective | null; // nullなら新規
  index: number;
  onSaveNew: (obj: ObjectiveInput) => void;
  onUpdate: (objId: number, obj: ObjectiveUpdate) => void;
};

export function ObjectiveRow({ taskId, objective, index, onSaveNew, onUpdate }: ObjectiveRowProps) {
  const isNew = !objective;
  const [title, setTitle] = useState(objective?.title ?? "");
  const [dueDate, setDueDate] = useState(objective?.due_date ?? undefined);

  const handleTitleSave = (newTitle: string) => {
    setTitle(newTitle);
    if (isNew) {
      onSaveNew({ task_id: taskId, title: newTitle, due_date: dueDate });
    } else if (objective) {
      onUpdate(objective.id,{title:newTitle});
    }
  };

  const handleDateSave = (newDate: string | undefined) => {
    setDueDate(newDate);
    if (objective) {
      onUpdate(objective.id, { due_date: newDate });
    }
  };

  return (
    <tr className="border-b">
      <td className="px-3 py-2">
        <EditableCell value={title} onSave={handleTitleSave} />
      </td>
        {!isNew && (
          <>
          <td className="px-3 py-2">
            <DateCell value={dueDate} onSave={handleDateSave} />
          </td>
          <td className="px-3 py-2">{objective?.status ? objective.status : "-"}</td>
          <td className="px-3 py-2">{objective?.assigned_user_name ?? "-"}</td>
          <td className="px-3 py-2">{objective?.latest_progress ?? "-"}</td>
          <td className="px-3 py-2">{objective?.latest_report_date ?? "-"}</td>
          <td className="px-3 py-2">
            <button className="text-blue-600 hover:underline text-xs">履歴</button>
          </td>
        </>
        )}
    </tr>
  );
}

