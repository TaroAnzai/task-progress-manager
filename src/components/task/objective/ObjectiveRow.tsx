// src/components/task/ObjectiveRow.tsx
import { useState } from "react";
import { EditableCell } from "./objective/EditableCell";
import { DateCell } from ".objective/DateCell";
import type { Objective } from "@/api/generated/taskProgressAPI.schemas";

type ObjectiveRowProps = {
  objective: Objective | null; // nullなら新規
  index: number;
  onSaveNew: (obj: Partial<Objective>) => void;
  onUpdate: (id: number, updates: Partial<Objective>) => void;
};

export function ObjectiveRow({ objective, index, onSaveNew, onUpdate }: ObjectiveRowProps) {
  const isNew = !objective || !objective.id;
  const [title, setTitle] = useState(objective?.title ?? "");
  const [dueDate, setDueDate] = useState(objective?.due_date ?? null);

  const handleTitleSave = (newTitle: string) => {
    setTitle(newTitle);
    if (isNew) {
      onSaveNew({ title: newTitle, due_date: dueDate });
    } else if (objective) {
      onUpdate(objective.id, { title: newTitle });
    }
  };

  const handleDateSave = (newDate: string | null) => {
    setDueDate(newDate);
    if (isNew) {
      onSaveNew({ title, due_date: newDate });
    } else if (objective) {
      onUpdate(objective.id, { due_date: newDate });
    }
  };

  return (
    <tr className="border-b">
      <td className="px-3 py-2">{isNew ? "＋" : index + 1}</td>
      <td className="px-3 py-2">
        <EditableCell value={title} onSave={handleTitleSave} />
      </td>
      <td className="px-3 py-2">
        <DateCell value={dueDate} onSave={handleDateSave} />
      </td>
      <td className="px-3 py-2">{objective?.status_id ? getStatusLabel(objective.status_id) : "-"}</td>
      <td className="px-3 py-2">{objective?.assigned_user_name ?? "-"}</td>
      <td className="px-3 py-2">{objective?.latest_progress ?? "-"}</td>
      <td className="px-3 py-2">{objective?.latest_report_date ?? "-"}</td>
      <td className="px-3 py-2">
        {!isNew && <button className="text-blue-600 hover:underline text-xs">履歴</button>}
      </td>
    </tr>
  );
}

function getStatusLabel(statusId: number): string {
  switch (statusId) {
    case 1:
      return "未着手";
    case 2:
      return "進行中";
    case 3:
      return "完了";
    case 4:
      return "保留";
    default:
      return "不明";
  }
}
