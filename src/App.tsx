// src/App.tsx
import Header from "@/components/layout/Header";
import TaskPage from "@/pages/TaskPage";
import "./index.css"; // ✅ Tailwindを有効にする

export default function App() {
  const userData = { getDisplayId: () => 123 };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main>
        <TaskPage userData={userData} />
      </main>
    </div>
  );
}
