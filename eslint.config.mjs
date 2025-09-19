// eslint.config.mjs
import eslint from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist', 'node_modules'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // 🚫 No obligar a saltos de línea en parámetros
      'function-paren-newline': 'off',

      // 🚫 No obligar a coma final en parámetros/objetos
      'comma-dangle': 'off',
      '@typescript-eslint/comma-dangle': 'off',

      // ⚡ Configuración de Prettier para que no interfiera
      'prettier/prettier': [
        'error',
        {
          trailingComma: 'none', // sin coma final
          bracketSameLine: true, // evita salto de línea automático
        },
      ],

      // Opcional: reglas típicas para NestJS
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  }
)
