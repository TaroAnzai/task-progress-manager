import { config } from 'dotenv';

config({ path: '.env.development' });

export default {

  progressApi: {
    input: process.env.VITE_OPENAPI_URL,
    output: {
      target: './src/api/generated/progressApi.ts',
      schemas: './src/api/generated/model',
      client: 'react-query',
      clean: true,
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/api/axiosInstance.ts',
          name: 'default', // axiosInstance.tsがexport defaultの場合
        },

      },

    },
  },
};

