module.exports = {
  parser: "typescript-eslint-parser",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: { modules: true },
  },
  plugins: ["prettier", "typescript"],
  extends: ["eslint:recommended"],
  rules: {
    "no-unused-vars": "off",
    "typescript/no-unused-vars": ["error"],
    "prefer-arrow-callback": ["error"],
  },
};
