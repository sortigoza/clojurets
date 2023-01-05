module.exports = {
  // Global ESLint Settings
  // =================================
  root: true,
  env: {
    browser: true,
    node: true,
    jasmine: true,
    jest: true,
  },
  ignorePatterns: ['node_modules/*'],
  settings: {},

  // ===========================================
  // Set up ESLint for .js / .jsx files
  // ===========================================
  // .js / .jsx uses babel-eslint
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {},
  },

  // Plugins
  // =================================
  plugins: ['prettier', 'literal-checker'],

  // Extend Other Configs
  // =================================
  extends: ['eslint:recommended', 'prettier'],

  rules: {},

  // =================================
  // Overrides for Specific Files
  // =================================
  overrides: [
    // Match TypeScript Files
    // =================================
    {
      files: ['**/*.{ts,tsx}'],

      // Global ESLint Settings
      // =================================
      env: {},
      settings: {},

      // Parser Settings
      // =================================
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
      },

      // Plugins
      // =================================
      plugins: ['@typescript-eslint', 'prettier', 'literal-checker'],

      // Extend Other Configs
      // =================================
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
        'prettier/prettier': 'error',
      },
    },
  ],
};
