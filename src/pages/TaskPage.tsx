// src/pages/TaskPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import {  useUser } from "@/context/UserContext";



const TaskPageContent = () =>{
  const { user, loading:userLoading, hasAdminScope, getUserRole,refetchUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    if (userLoading) return; 
    if (!user){
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [userLoading, user, navigate, location.pathname]);

  if (userLoading) return <p className="text-gray-500">読み込み中...</p>;
  if (!user)  return null;
  return (
    <p className="font-bold text-lg mb-4">👤 {user.name} (ID: {user.id}) organization:( {user.organization_name}) 
      権限:({String(getUserRole())})
      </p>
  );
}

export default function TaskPage() {
  return (
      <TaskPageContent />
  );
}
