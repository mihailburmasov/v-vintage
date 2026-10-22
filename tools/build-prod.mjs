// Боевая сборка для v-vintage.ru → dist/
process.env.MODE = 'prod';
await import('../src/build.mjs');
