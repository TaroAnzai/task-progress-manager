import {
  useGetProgressAiResultJobId,
  usePostProgressAiSuggest,
} from '@/api/generated/taskProgressAPI';
import { AIResultStatus } from '@/api/generated/taskProgressAPI.schemas';

export const useCreateAiSuggestJob = () => {
  const { mutateAsync } = usePostProgressAiSuggest();

  return async (input: any) => {
    const res = await mutateAsync({ data: input });
    return res.job_id; // { job_id: string }
  };
};

export const useAiResultPolling = (jobId: string | null) => {
  return useGetProgressAiResultJobId(jobId ?? '', {
    query: {
      enabled: !!jobId, // jobIdがあるときだけ
      refetchInterval: (query) => {
        if (!jobId) return false; // jobIdが無ければ停止
        const data = query.state.data;
        if (!data) return 1000;
        return data.status !== AIResultStatus.PENDING ? false : 1000;
      },
    },
  });
};
