import api from './index';

/**
 * AIにタスク情報を送信し、補完を依頼する
 * @param taskData タイトル・説明・期限などのタスク情報
 * @param mode 'task_name' または 'objectives'
 * @returns 補完されたタイトルまたはオブジェクティブ配列
 */
export async function requestAISuggestion(
  taskData: { title: string; description?: string; deadline?: string },
  mode: 'task_name' | 'objectives'
): Promise<string | string[]> {
  const res = await api.post<{ job_id: string }>('/ai/suggest', {
    task_info: taskData,
    mode
  });

  const jobId = res.data.job_id;
  return await pollAIResult(jobId, mode);
}

/**
 * AI結果をポーリング取得する
 * @param jobId リクエスト時に得たジョブID
 * @param mode モード
 */
async function pollAIResult(
  jobId: string,
  mode: 'task_name' | 'objectives'
): Promise<string | string[]> {
  const MAX_RETRY = 10;
  const DELAY_MS = 1000;

  for (let i = 0; i < MAX_RETRY; i++) {
    await delay(DELAY_MS);

    const res = await api.get<{ status: string; result: any }>(`/ai/result/${jobId}`);
    const result = res.data;

    if (result.status === 'success') {
      if (mode === 'task_name') {
        return result.result.title;
      } else if (mode === 'objectives') {
        return result.result.objectives || [];
      }
    }
  }
  throw new Error('AI結果の取得にタイムアウトしました');
}

/**
 * ポーリング用遅延関数
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
