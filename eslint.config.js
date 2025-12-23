import js from '@eslint/js';
import checkFilePlugin from 'eslint-plugin-check-file';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
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
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {},
      },
    },
    plugins: {
      react: reactPlugin,
      'check-file': checkFilePlugin,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      // Function component definitions: named components as function declarations, unnamed as function expressions
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'function-expression',
        },
      ],
      'react/jsx-filename-extension': ['warn', { extensions: ['.tsx', '.jsx'] }],
      'react/jsx-wrap-multilines': 'warn',
      'react/jsx-props-no-spreading': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-closing-bracket-location': ['error', { selfClosing: 'line-aligned', nonEmpty: 'line-aligned' }],
      'react/jsx-closing-tag-location': 'error',
      'jsx-quotes': ['error', 'prefer-double'],

      // Spacing in self-closing tags
      'react/jsx-tag-spacing': 'error',

      // Self-close components with no children
      'react/self-closing-comp': 'error',

      // Spacing inside JSX curly braces
      'react/jsx-curly-spacing': ['error', { when: 'never', children: true, allowMultiline: true }],

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

      // Avoid array index as key
      'react/no-array-index-key': 'error',

      // camelCase prop names (enforce consistent JS props)
      'react/jsx-props-no-multi-spaces': 'error',

      // Enforce PascalCase for React component names
      'react/jsx-pascal-case': 'error',

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
      'react-refresh/only-export-components': 'off',
    },
  },
]);
