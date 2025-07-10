import api from './index';
import { getCurrentUserId } from '@/utils/auth'; // 実装に応じて置き換えてください
import type { Objective, ProgressEntry } from '@/types/objective';

// オブジェクティブをタスクに登録
export async function createObjective(objectiveData: Partial<Objective>): Promise<Objective> {
  const createdBy = getCurrentUserId();
  const res = await api.post<Objective>('/objectives', {
    ...objectiveData,
    created_by: createdBy
  });
  return res.data;
}

// オブジェクティブのフィールドを更新
export async function updateObjectiveField(
  objectiveId: number,
  field: string,
  value: any
): Promise<Objective> {
  const user_id = getCurrentUserId();
  const res = await api.put<Objective>(`/objectives/${objectiveId}`, {
    [field]: value,
    user_id
  });
  return res.data;
}

// ステータス更新
export async function updateObjectiveStatus(objectiveId: number, statusId: number): Promise<Objective> {
  const user_id = getCurrentUserId();
  const res = await api.put<Objective>(`/objectives/${objectiveId}`, {
    status_id: statusId,
    user_id
  });
  return res.data;
}

// 期限更新
export async function updateObjectiveDate(objectiveId: number, newDate: string): Promise<Objective> {
  const user_id = getCurrentUserId();
  const res = await api.put<Objective>(`/objectives/${objectiveId}`, {
    due_date: newDate,
    user_id
  });
  return res.data;
}

// IDで取得
export async function fetchObjectiveById(objectiveId: number): Promise<Objective> {
  const user_id = getCurrentUserId();
  const res = await api.get<Objective>(`/objectives/${objectiveId}`, {
    params: { user_id }
  });
  return res.data;
}

// タスクに紐づくオブジェクティブ一覧を取得
export async function fetchObjectivesByTaskId(taskId: number): Promise<Objective[]> {
  const user_id = getCurrentUserId();
  const res = await api.get<Objective[]>(`/tasks/${taskId}/objectives`, {
    params: { user_id }
  });
  return res.data;
}

// オブジェクティブの順序を更新
export async function updateObjectiveOrder(taskId: number, orderedIds: number[]): Promise<{ message: string }> {
  const res = await api.post<{ message: string }>(`/tasks/${taskId}/objectives/order`, {
    order: orderedIds
  });
  return res.data;
}

// オブジェクティブを削除
export async function deleteObjective(objectiveId: number): Promise<{ message: string }> {
  const user_id = getCurrentUserId();
  const res = await api.delete<{ message: string }>(`/objectives/${objectiveId}`, {
    params: { user_id }
  });
  return res.data;
}
// 進捗登録
export async function createProgressEntry(
  objectiveId: number,
  progressData: Partial<ProgressEntry>
): Promise<ProgressEntry> {
  const res = await api.post<ProgressEntry>(`/objectives/${objectiveId}/progress`, progressData);
  return res.data;
}

// 進捗履歴取得
export async function fetchProgressHistory(objectiveId: number): Promise<ProgressEntry[]> {
  const res = await api.get<ProgressEntry[]>(`/objectives/${objectiveId}/progress`);
  return res.data;
}

// 最新進捗のみ取得
export async function fetchLatestProgress(objectiveId: number): Promise<ProgressEntry> {
  const res = await api.get<ProgressEntry>(`/objectives/${objectiveId}/latest-progress`);
  return res.data;
}

// 進捗削除
export async function deleteProgressEntry(progressId: number): Promise<{ message: string }> {
  const user_id = getCurrentUserId();
  const res = await api.delete<{ message: string }>(`/progress/${progressId}`, {
    params: { user_id }
  });
  return res.data;
}
