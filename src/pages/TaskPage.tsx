// src/pages/TaskPage.tsx
export default function TaskPage({ userData }: { userData: any }) {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">タスク一覧（開発中）</h2>
      <div className="bg-white rounded shadow p-4">
        <p>ここにタスク一覧が表示されます。</p>
        <p className="text-sm text-gray-600 mt-2">
          ユーザーID: {userData?.getDisplayId?.() ?? "不明"}
        </p>
      </div>
    </div>
  );
}
