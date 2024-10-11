// eslint.config.js (CommonJS version)
const js = require('@eslint/js')
const react = require('eslint-plugin-react')
const prettier = require('eslint-plugin-prettier')
const prettierConfig = require('eslint-config-prettier')

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': 'warn', // Change to 'warn' if you don't want errors for unused variables
      'no-undef': 'warn', // Same for undefined variables
    },
  },
  prettierConfig,
]
