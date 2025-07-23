import { useQueryClient } from '@tanstack/react-query';
import {
  useGetProgressSessionsCurrent,
  usePostProgressSessions,
  usePostProgressSessionsById,
  useDeleteProgressSessionsCurrent,
} from '@/api/generated/progressApi';

import type {
  Login,               // メールログイン用入力型
  WPLogin,             // WP IDログイン用入力型
  User,                // ユーザー情報取得用
  Message,             // 成功時メッセージ（ログアウトなど）
  ErrorResponse,       // エラー型
  DefaultErrorResponse,
  UnprocessableEntityResponse,
} from '@/api/generated/model';

/**
 * ✅ 現在のユーザー取得
 * UI側で扱いやすいよう、取得結果をそのまま返します。
 */
export const useCurrentUser = () => {
  const { data, isLoading, error } = useGetProgressSessionsCurrent();
  return { data, isLoading, error };
};

/**
 * ✅ メールアドレス + パスワードログイン
 * 成功時、現在のユーザー情報を再取得するためキャッシュを無効化します。
 */
export const useLoginByEmail = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = usePostProgressSessions({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getProgressSessionsCurrent'] });
      },
    },
  });
  return { mutate, isPending, error };
};

/**
 * ✅ WordPress IDログイン
 * 成功時、現在のユーザー情報を再取得するためキャッシュを無効化します。
 */
export const useLoginByWPId = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = usePostProgressSessionsById({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getProgressSessionsCurrent'] });
      },
    },
  });
  return { mutate, isPending, error };
};

/**
 * ✅ ログアウト
 * 成功時、現在のユーザー情報キャッシュをクリアします。
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useDeleteProgressSessionsCurrent({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getProgressSessionsCurrent'] });
      },
    },
  });
  return { mutate, isPending, error };
};
