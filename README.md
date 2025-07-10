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
