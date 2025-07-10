export interface Objective {
  id: number;
  task_id: number;
  title: string;
  status_id: number;
  due_date?: string;
  created_by: number;
  // 他に必要なプロパティがあれば追加
}

export interface ProgressEntry {
  id: number;
  objective_id: number;
  detail: string;
  report_date: string;
  updated_by: number;
}
