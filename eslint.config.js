import js from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import checkFilePlugin from 'eslint-plugin-check-file';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['**/node_modules', '**/dist', '**/out']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      eslintReact.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
    plugins: {
      'check-file': checkFilePlugin,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      // JSX file extension enforcement (was react/jsx-filename-extension)
      '@eslint-react/naming-convention/filename-extension': ['warn', { extensions: ['.tsx', '.jsx'] }],

      'jsx-quotes': ['error', 'prefer-double'],

      // Prevent extra spaces anywhere
      'no-multi-spaces': 'error',

      // Accessibility rules
      'jsx-a11y/alt-text': [
        'error',
        {
          elements: ['img'],
          img: ['Image'],
          object: ['Object'],
          area: ['Area'],
          'role-presentational': true,
        },
      ],
      'jsx-a11y/img-redundant-alt': 'error',
      'jsx-a11y/aria-role': ['error', { allowedRoles: [] }],
      'jsx-a11y/no-access-key': 'error',

      // Avoid array index as key (was react/no-array-index-key)
      '@eslint-react/no-array-index-key': 'error',

      // Enforce PascalCase for React component names (was react/jsx-pascal-case)
      '@eslint-react/naming-convention/component-name': 'error',

      // Enforce file naming convention to be kebab-case
      'check-file/filename-naming-convention': [
        'error',
        {
          'src/**/!(*.d).{ts,tsx,js,jsx}': 'KEBAB_CASE',
        },
      ],

      // Enforce folder naming convention to be kebab-case
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/**/': 'KEBAB_CASE',
        },
      ],
      '@eslint-react/hooks-extra/no-direct-set-state-in-use-effect': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
]);
