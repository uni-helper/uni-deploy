import { defineConfig } from 'rollup';
import { rollupIndexConfig, rollupIndexTypesConfig, rollupCliConfig } from '@modyqyw/utils';

export default defineConfig([
  rollupIndexConfig({ emitCjs: false }),
  rollupIndexTypesConfig(),
  rollupCliConfig(),
]);
