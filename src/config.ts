import JoyCon from 'joycon';
import { bundleRequire } from 'bundle-require';
import stripJsonComments from 'strip-json-comments';
import { loadJson } from './utils';
import type { JoyConOptions, UniDeployConfig, UniDeployUserConfig } from './types';

export const defaultCwd = process.cwd();

export const defaultConfig: UniDeployConfig = {
  cwd: defaultCwd,
};

export const defineConfig = (config: UniDeployUserConfig) => config;

export const mergeConfig = (config: UniDeployUserConfig) => ({
  ...defaultConfig,
  ...config,
});

export const loadConfig = async (
  options?: Partial<JoyConOptions>,
): Promise<{
  path?: string;
  data?: UniDeployConfig;
}> => {
  const joycon = new JoyCon();
  const configPath = await joycon.resolve({
    files: [
      'uni-deploy.config.ts',
      'uni-deploy.config.cts',
      'uni-deploy.config.mts',
      'uni-deploy.config.js',
      'uni-deploy.config.cjs',
      'uni-deploy.config.mjs',
      'uni-deploy.config.json',
      'package.json',
    ],
    packageKey: 'uni-deploy',
    parseJSON: (json) => stripJsonComments(json),
    ...options,
  });

  if (!configPath) return {};

  if (configPath.endsWith('.json')) {
    let data = await loadJson(configPath);
    if (configPath.endsWith('package.json')) {
      data = data?.['uni-deploy'];
    }
    return data ? { path: configPath, data } : {};
  }

  const config = await bundleRequire({
    filepath: configPath,
  });
  return {
    path: configPath,
    data: config.mod['uni-deploy'] || config.mod.default || config.mod,
  };
};
