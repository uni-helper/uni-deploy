import { unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['./src/index', './src/cli'],
  clean: true,
  declaration: true,
  rollup: {
    inlineDependencies: true,
    esbuild: {
      target: 'node18',
    },
  },
  hooks: {
    'build:done': (ctx) => {
      const { outDir } = ctx.options;
      unlinkSync(resolve(outDir, 'cli.d.ts'));
    },
  },
});
