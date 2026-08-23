import coreWebVitals from "eslint-config-next/core-web-vitals";

// eslint-plugin-react-hooks v7 ships new React-Compiler-powered rules.
// The violations they flag require real refactors tracked in
// docs/frontend/sprints (Sprints 02/04/05). Downgraded to warnings for the
// Sprint 00 baseline so the gate is runnable without behavior changes.
const reactHooksV7Transitional = {
  rules: {
    "react-hooks/set-state-in-effect": "warn",
    "react-hooks/static-components": "warn",
    "react-hooks/immutability": "warn",
    "react-hooks/purity": "warn",
    "react-hooks/refs": "warn",
    "react-hooks/preserve-manual-memoization": "warn",
  },
};

const eslintConfig = [
  ...coreWebVitals,
  reactHooksV7Transitional,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
