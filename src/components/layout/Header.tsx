// src/components/layout/Header.tsx
export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">進捗管理システム</h1>
      <nav className="flex gap-4">
        <a href="/" className="hover:underline">タスク一覧</a>
        <a href="/objectives" className="hover:underline">オブジェクティブ</a>
        <a href="/settings" className="hover:underline">設定</a>
      </nav>
    </header>
  );
}
