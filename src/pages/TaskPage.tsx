// src/pages/TaskPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import {  useUser } from "@/context/UserContext";
import TaskControlPanel from "@/components/task/TaskControlPanel";
import { useTasks } from "@/context/TaskContext";
import TaskSettingModal from "@/components/task/taskModal/TaskSettingModal";
import type { Task } from "@/api/generated/taskProgressAPI.schemas";
import TaskList from "@/components/task/TaskList";

const TaskPageContent = () =>{
  const { user, loading:userLoading, hasAdminScope, getUserRole,refetchUser } = useUser();
  const { tasks, isLoading, refetch } = useTasks();
  const navigate = useNavigate();
  const location = useLocation();
  const [modalOpen , setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // selectedTask

  useEffect(() => {
    if (userLoading) return; 
    if (!user){
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [userLoading, user, navigate, location.pathname]);

  if (userLoading) return <p className="text-gray-500">読み込み中...</p>;
  if (!user)  return null;
  return (
    <>
        <p className="font-bold text-lg mb-4">👤 {user.name} (ID: {user.id}) organization:( {user.organization_name}) 
      権限:({String(getUserRole())})
      </p>
      <TaskControlPanel
       onAddTask={() => {setModalOpen(true);}
       } 
       onEditTasks={() => {}} onToggleViewSelector={() => {}}></TaskControlPanel>
      <TaskList />

        <TaskSettingModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          task={selectedTask}
        />
    </>

  );
}

export default function TaskPage() {    
  return (
      <TaskPageContent />
  );
}
