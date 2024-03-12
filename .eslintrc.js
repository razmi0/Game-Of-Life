module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:solid/typescript", "plugin:jsx-a11y/strict"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "solid", "jsx-a11y"],
  rules: {
    "no-unused-vars": ["warn"],
    "no-empty": "warn",
  },
};
