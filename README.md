# Task Progress Manager

タスクの進捗を視覚的かつ効率的に管理できる、React ベースの Web アプリケーションです。

## 📌 概要

このアプリは、複数のタスクに対して進捗状況を記録・管理し、オブジェクティブ（目標）単位での可視化を可能にするツールです。  
既存のバックエンド（Flask API）と連携してデータを取得・更新します。

## 🚀 技術スタック

- Frontend: [React](https://react.dev/)
- Build Tool: [Vite](https://vitejs.dev/)
- HTTP通信: [Axios](https://axios-http.com/)
- 状態管理: React Hooks（`useState`, `useEffect` など）
- スタイリング: CSS Modules または Tailwind（任意）
- バックエンドAPI: Flask（別リポジトリ）

## 🔧 セットアップ手順

```bash
# リポジトリをクローン
git clone https://github.com/your-username/task-progress-manager.git
cd task-progress-manager

# 依存パッケージをインストール
npm install

# 開発サーバーを起動
npm run dev
````

---

## 🔗 バックエンドAPIとの連携

このプロジェクトは、バックエンド（Flask API）との通信に以下の仕組みを採用しています。

### **API呼び出し構成**

* **OpenAPI仕様**: Flask-Smorestが自動生成する `/openapi.json` を利用
* **[orval](https://orval.dev/)**: OpenAPI仕様から **React Query Hooks** と **TypeScript型定義**を自動生成
* **Axios（カスタムインスタンス）**: 認証ヘッダーやエラーハンドリングを一元管理

### **メリット**

1. **型安全** – API型はバックエンドと常に同期
2. **開発効率向上** – 生成されたHooks（例：`useGetTasks()`）を直接利用可能
3. **状態管理自動化** – React Queryがローディング・キャッシュ・エラー管理を自動化
4. **簡単な保守** – バックエンドが更新された際は以下のコマンドを実行するだけ

```bash
npx orval
```

### **実装例**

```tsx
import { useGetTasks } from '@/api/progressApi';

const TaskList = () => {
  const { data: tasks, isLoading, error } = useGetTasks();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <ul>
      {tasks?.map(task => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
};
```

### **orval 設定ファイル例（`orval.config.ts`）**

```ts
export default {
  progressApi: {
    input: 'http://localhost:5000/openapi.json',
    output: {
      target: './src/api/progressApi.ts',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/api/customAxios.ts', // 認証などを付与する場合
          name: 'customInstance',
        },
      },
    },
  },
};
```


