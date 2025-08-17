// src/pages/TaskPage.tsx
import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { NewTaskModal } from "@/components/task/newTaskModal/NewTaskModal";
import { TaskControlPanel } from "@/components/task/TaskControlPanel";
import { TaskList } from "@/components/task/TaskList";
import {TaskOrderSettingModal} from "@/components/task/taskSettingOrderModal/TaskOrderSettingModal";
import { TestModal } from "@/components/TestModal";

import { useUser } from "@/context/useUser";
const TaskPageContent = () => {
  const { user, loading: userLoading, getUserRole } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [taskOrderModalOpen, setTaskOrderModalOpen] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [userLoading, user, navigate, location.pathname]);

  if (userLoading) return <p className="text-gray-500">読み込み中...</p>;
  if (!user) return null;
  return (
    <>
      <p className="font-bold text-lg mb-4">👤 {user.name} (ID: {user.id}) organization:( {user.organization_name})
        権限:({String(getUserRole())})
      </p>
      <TaskControlPanel
        onAddTask={() => { setNewTaskModalOpen(true); }}
        onEditTasks={() => {setTaskOrderModalOpen(true);}}
        onToggleViewSelector={() => {setTestModalOpen(true)}}
      />
      <TaskList />

      <NewTaskModal
        open={newTaskModalOpen}
        onClose={() => setNewTaskModalOpen(false)}
      />
      <TaskOrderSettingModal
        open={taskOrderModalOpen}
        onClose={() => {setTaskOrderModalOpen(false)}}
        onDelete={() => { }}
      />
      <TestModal
        open={testModalOpen}
        onClose={() => {setTestModalOpen(false)}}
      />
    </>

  );
}

export default function TaskPage() {
  return (
    <TaskPageContent />
  );
}
