import JoyCon from 'joycon';
import { bundleRequire } from 'bundle-require';
import stripJsonComments from 'strip-json-comments';
import { loadJson } from './utils';
import type { Options as JoyConOptions } from 'joycon';
import type { MpWeixinConfig } from './platform';
import type { WecomConfig, DingtalkConfig } from './im';

export type { Options as PRetryOptions } from 'p-retry';
export type { Options as GotOptions } from 'got';

export interface UniDeployConfig {
  cwd: string;
  'mp-weixin'?: MpWeixinConfig;
  wecom?: WecomConfig;
  dingtalk?: DingtalkConfig;
  [key: string]: any;
}

export interface UniDeployUserConfig extends Partial<UniDeployConfig> {}

export const defaultCwd = process.cwd();

export const defaultConfig: UniDeployConfig = {
  cwd: defaultCwd,
};

export function defineConfig(config: UniDeployUserConfig) {
  return config;
}

export function mergeConfig(config: UniDeployUserConfig) {
  return {
    ...defaultConfig,
    ...config,
  };
}

export async function loadConfig(options?: Partial<JoyConOptions>): Promise<{
  path?: string;
  data?: UniDeployConfig;
}> {
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
}
