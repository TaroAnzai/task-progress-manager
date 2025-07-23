import { useQueryClient } from '@tanstack/react-query';
import {
  // orval生成済みフック
  useGetProgressTaskOrders,
  usePostProgressTaskOrders as usePostProgressTaskOrdersBase,
} from '@/api/generated/progressApi';
import type {
  // 引数・戻り値の型（必要最小限のみインポート）
  GetProgressTaskOrdersParams,
  TaskOrder,
  TaskOrderInput,
  Message,
  ErrorResponse,
  UnprocessableEntityResponse,
  DefaultErrorResponse,
} from '@/api/generated/model';

export const useTaskOrders = (params?: GetProgressTaskOrdersParams) => {
  const { data, isLoading, error } = useGetProgressTaskOrders(params);
  return { data, isLoading, error };
};
export const useTaskOrderscloud = (params: GetProgressTaskOrdersParams) => {
  const { data, isLoading, error } = useGetProgressTaskOrders(params);
  return { data, isLoading, error };
};

/**
 * タスク順序更新
 * @returns { mutate, isPending, error }
 */
export const useUpdateTaskOrder = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = usePostProgressTaskOrdersBase({
    mutation: {
      onSuccess: () => {
        // タスク順序一覧キャッシュを無効化
        queryClient.invalidateQueries({ queryKey: ['getTaskOrders'] });
      },
    },
  });

  return { mutate, isPending, error };
};
