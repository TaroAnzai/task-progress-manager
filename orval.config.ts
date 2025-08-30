import { config } from 'dotenv';
import * as path from 'path';

// NODE_ENV に応じて環境ファイルを切り替え
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

config({ path: path.resolve(process.cwd(), envFile) });

export default {
  progressApi: {
    input: process.env.VITE_OPENAPI_URL,
    output: {
      mode: 'split',
      target: './src/api/generated/',
      client: 'react-query',
      clean: true,
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/api/axiosInstance.ts',
          name: 'customInstance',
        },
      },
    },
  },
};
