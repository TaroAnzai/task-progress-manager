export interface Task {
  id: number;
  title: string;
  description?: string;
  deadline?: string;
  status_id: number;
  created_by: number;
  // 他のフィールドがあれば追加
}
