module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react'],
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
    rules: {
      // Add your custom rules here
      'react/react-in-jsx-scope': 'off', // Not required in React 17+
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true, // Enables short-circuit expressions like a && b
          allowTernary: true, // Enables ternary expressions like a ? b : c
        },
      ],
    },
    overrides: [
      {
        files: ['*.ts', '*.tsx'],
        rules: {
          // TypeScript-specific rules
        },
      },
    ],
  };