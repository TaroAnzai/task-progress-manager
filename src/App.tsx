// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "@/components/layout/Header";
import TaskPage from "@/pages/TaskPage";
import LoginPage from "@/pages/LoginPage"; // ✅ ログインページを追加
import ProgressAdminPage from "@/pages/ProgressAdminPage.tsx";
import "./index.css"; // ✅ Tailwindを有効にする

export default function App() {
  const userData = { getDisplayId: () => 123 };

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Header />
        <main>
          <Routes>
            {/* ✅ トップページ（タスクページ） */}
            <Route path="/" element={<TaskPage userData={userData} />} />

            {/* ✅ ログインページ */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<ProgressAdminPage />} />
          </Routes>
          <Toaster richColors position="top-center" />
        </main>
      </div>
    </Router>
  );
}

