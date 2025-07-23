import { useQueryClient } from '@tanstack/react-query';
import { useTasksControllerFindAll, useTasksControllerUpdate } from '@/api/generated'; 
import { axiosInstance } from '@/api/axiosInstance';

export const useTasks = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useTasksControllerFindAll();

  const { mutateAsync: updateTask } = useTasksControllerUpdate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    },
  });

  return {
    data,
    isLoading,
    error,
    updateTask,
  };
};
