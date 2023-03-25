import { build, BuildOptions } from 'esbuild';

const options: BuildOptions = {
  entryPoints: ['src/main.ts'],
  outfile: 'dist/main.js',
  bundle: true,
  minify: true,
  platform: 'node',
  format: 'esm',
  banner: {
    js: 'import { createRequire } from "module";const require = createRequire(import.meta.url);',
  },
  logLevel: 'info',
};

build(options).catch(() => process.exit(1));
