import  React  from 'react'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'
import AlertDialogProvider from "./context/AlertDialogProvider";
import  TaskProvider  from "./context/TaskProvider";
import  UserProvider  from "./context/UserProvider";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TaskProvider>
          <AlertDialogProvider>
            <App />
          </AlertDialogProvider>
        </TaskProvider>
      </UserProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
