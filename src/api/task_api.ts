import api from './index';
import { getCurrentUserId } from '@/utils/auth'; // 必要に応じて現在のユーザーID取得
import type { Task } from '@/types/task';

export async function createTaskAPI(taskData: Partial<Task>): Promise<Task> {
  const res = await api.post<Task>('/tasks', taskData);
  return res.data;
}

export async function updateTaskAPI(taskId: number, taskData: Partial<Task>): Promise<Task> {
  const res = await api.put<Task>(`/tasks/${taskId}`, taskData);
  return res.data;
}

export async function deleteTaskAPI(taskId: number, userId: number): Promise<{ message: string }> {
  const res = await api.delete<{ message: string }>(`/tasks/${taskId}`, {
    params: { user_id: userId }
  });
  return res.data;
}

export async function fetchTasksByUser(userId: number): Promise<Task[]> {
  const res = await api.get<Task[]>('/tasks', {
    params: { user_id: userId }
  });
  return res.data;
}

export async function updateTaskStatus(taskId: number, statusId: number, userId: number): Promise<Task> {
  const res = await api.put<Task>(`/tasks/${taskId}`, {
    user_id: userId,
    status_id: statusId
  });
  return res.data;
}

export async function postTaskOrder(taskIds: number[]): Promise<{ message: string }> {
  const userId = getCurrentUserId();
  const res = await api.post<{ message: string }>(`/task_order/${userId}`, {
    task_ids: taskIds
  });
  return res.data;
}

export async function exportTasksData(userId: number, format: 'excel' | 'yaml' | 'json' = 'excel'): Promise<Blob | string> {
  const res = await api.get<Blob | string>(`/tasks/export/${userId}`, {
    params: { format },
    responseType: format === 'excel' ? 'blob' : 'text'
  });

  return res.data;
}
