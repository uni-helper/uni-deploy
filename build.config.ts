import { defineBuildConfig } from 'unbuild';
import { unlinkSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineBuildConfig({
  entries: ['./src/index', './src/cli'],
  clean: true,
  declaration: true,
  rollup: {
    inlineDependencies: true,
    esbuild: {
      target: 'node14.18',
    },
  },
  hooks: {
    'build:done': (ctx) => {
      const { outDir } = ctx.options;
      unlinkSync(resolve(outDir, 'cli.d.ts'));
    },
  },
});
