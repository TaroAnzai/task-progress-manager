import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === 'serve'; // npm run dev の場合

  let serverConfig = {
    host: 'localhost',
    port: 5173,
    https: {}, // HTTPS設定
  };

  // 開発環境の場合のみHTTPS設定を追加
  if (isDev) {
    const keyPath = './ssl/localhost.key';
    const certPath = './ssl/localhost.crt';

    // SSL証明書ファイルの存在確認
    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      serverConfig.https = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      };
    } else {
      console.warn('SSL証明書が見つかりません。HTTPで起動します。');
    }
  }

  return {
    plugins: [react()],
    base: '/progress',
    server: serverConfig,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});
