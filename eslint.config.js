import js from '@eslint/js'
import { globalIgnores } from 'eslint/config'
import eslintPluginImport from "eslint-plugin-import";
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    ignores: [
      "src/api/generated/**",
      "src/components/ui/**"
    ]
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ["src/components/ui/**/*.tsx"],
    rules: {
      // 定数の export は許容（※オプションが使える環境なら）
      "react-refresh/only-export-components": "off",
    },
  },  
{
    plugins: {
      import: eslintPluginImport,
      'simple-import-sort': simpleImportSort,
    },
// ルール部だけ抜粋

  rules: {
    'import/order': 'off',
    'simple-import-sort/imports': ['warn', {
      groups: [
        // React
        ['^react$'],
        ['^type:react$'],

        // 外部ライブラリ
        ['^@?\\w'],
        ['^type:@?\\w'],

        // shadcn/ui（外部の次）
        ['^@/components/ui(/.*|$)'],
        ['^type:@/components/ui(/.*|$)'],

        // Orval 生成物
        ['^@/api/generated(/.*|$)'],
        ['^type:@/api/generated(/.*|$)'],

        // 内部 - フック
        ['^@/hooks(/.*|$)'],
        ['^type:@/hooks(/.*|$)'],

        // 内部 - コンポーネント（shadcn 以外）
        ['^@/components(/.*|$)'],
        ['^type:@/components(/.*|$)'],

        // 内部 - ユーティリティ / 定数
        ['^@/utils(/.*|$)', '^@/constants(/.*|$)'],
        ['^type:@/utils(/.*|$)', '^type:@/constants(/.*|$)'],

        // 残りの内部
        ['^@/'],
        ['^type:@/'],

        // 親相対
        ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
        ['^type:^\\.\\.(?!/?$)', '^type:^\\.\\./?$'],

        // 同階層 & index
        ['^\\./(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ['^type:^\\./(?!/?$)', '^type:^\\.(?!/?$)', '^type:^\\./?$'],
      ],
    }],
    'simple-import-sort/exports': 'warn',
  },
},
])
