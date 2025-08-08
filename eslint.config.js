import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'
import eslintPluginImport from "eslint-plugin-import";

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
    plugins: { import: eslintPluginImport },
    rules: {
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",   // Node組み込みやreactなど
            "external",  // npmライブラリ
            "internal",  // プロジェクト内（エイリアスimport）
            "parent",    // ../ 相対パス
            "sibling",   // ./ 相対パス
            "index"      // index.ts
          ],
          pathGroups: [
            {
              "pattern": "react",
              "group": "external",
              "position": "before"
            },
            {
              "pattern": "@/**",
              "group": "internal",
              "position": "before"
            }
          ],
          "pathGroupsExcludedImportTypes": ["react"],
          "newlines-between": "always", // グループ間に空行を入れる
          alphabetize: { order: "asc", caseInsensitive: true } // アルファベット順
        }
      ]
    }
  }
])
