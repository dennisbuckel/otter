/// <reference types="react-scripts" />

// sql.js ships its own types inside the package but TypeScript can't resolve
// them automatically via the package name → declare the module manually.
declare module 'sql.js';
