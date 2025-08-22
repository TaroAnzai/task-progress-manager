// src/pages/TaskPage.tsx
import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { TaskControlPanel } from "@/components/task/TaskControlPanel";
import { TaskList } from "@/components/task/TaskList";

import { useUser } from "@/context/useUser";
const TaskPageContent = () => {
  const { user, loading: userLoading, getUserRole } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [isObjExpand, setIsObjExpand] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [userLoading, user, navigate, location.pathname]);


  const onAllExpand = () => {
    setIsObjExpand(true);
  }
  const onAllCollapse = () => {
    setIsObjExpand(false);
  }


  if (userLoading) return <p className="text-gray-500">読み込み中...</p>;
  if (!user) return null;
  return (
    <>
      <p className="font-bold text-lg mb-4">👤 {user.name} (ID: {user.id}) organization:( {user.organization_name})
        権限:({String(getUserRole())})
      </p>
      <TaskControlPanel
        onAllExpand={onAllExpand}
        onAllCollapse={onAllCollapse}
      />
      <TaskList isExpandParent={isObjExpand} />


    </>

  );
}

export default function TaskPage() {
  return (
    <TaskPageContent />
  );
}
