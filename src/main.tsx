import  React  from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './index.css'
import App from './App.tsx'
import { UserProvider } from "./context/UserContext";
import {AlertDialogProvider} from "./context/AlertDialogContext";
import { TaskProvider } from "./context/TaskContext";

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
