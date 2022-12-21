import { defineConfig, type Options } from 'tsup';

const commonConfig: Options = {
  clean: true,
  minify: true,
  shims: true,
  splitting: false,
  target: 'node14.18',
};

export default defineConfig([
  {
    ...commonConfig,
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    footer: ({ format }) => {
      if (format === 'cjs') {
        return {
          js: `if (module.exports.default) module.exports = module.exports.default;`,
        };
      }
    },
  },
  {
    ...commonConfig,
    entry: ['./src/cli.ts'],
    format: 'esm',
  },
]);
