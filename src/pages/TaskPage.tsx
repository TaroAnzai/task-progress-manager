// src/pages/TaskPage.tsx
import { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { TaskControlPanel } from '@/components/task/TaskControlPanel';
import { TaskList } from '@/components/task/TaskList';

import { useUser } from '@/context/useUser';
import { type TaskUserAccessLevel } from '@/api/generated/taskProgressAPI.schemas';

const STORAGE_KEY = 'task_view_mode';
export type FilterAccessLevel = TaskUserAccessLevel | 'ASSIGNED';
const DEFAULT_FILTER: Record<FilterAccessLevel, boolean> = {
  VIEW: true,
  EDIT: true,
  FULL: true,
  OWNER: true,
  ASSIGNED: true,
};
const TaskPageContent = () => {
  const { user, loading: userLoading, getUserRole } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [filterLevels, setFilterLevels] = useState(DEFAULT_FILTER);
  const [isObjExpand, setIsObjExpand] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFilterLevels(parsed);
      } catch {
        setFilterLevels(DEFAULT_FILTER);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);
  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [userLoading, user, navigate, location.pathname]);

  const onAllExpand = () => {
    setIsObjExpand(true);
  };
  const onAllCollapse = () => {
    setIsObjExpand(false);
  };

  const handleChangeViewMode = (newValue: Record<FilterAccessLevel, boolean>) => {
    setFilterLevels(newValue);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
  };

  if (userLoading) return <p className="text-gray-500">読み込み中...</p>;
  if (!user) return null;
  return (
    <>
      <p className="font-bold text-lg mb-4">
        👤 {user.name} (ID: {user.id}) organization:( {user.organization_name}) 権限:(
        {String(getUserRole())})
      </p>
      <TaskControlPanel
        onAllExpand={onAllExpand}
        onAllCollapse={onAllCollapse}
        viewMode={filterLevels}
        onChangeViewMode={handleChangeViewMode}
      />
      <TaskList isExpandParent={isObjExpand} viewMode={filterLevels} />
    </>
  );
};

export default function TaskPage() {
  return <TaskPageContent />;
}
