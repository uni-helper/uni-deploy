import JoyCon, { Options as JoyConOptions } from 'joycon';
import { bundleRequire } from 'bundle-require';
import stripJsonComments from 'strip-json-comments';
// import {
//   loadConfig as unconfigLoadConfig,
//   LoadConfigOptions as UnconfigLoadConfigOptions,
// } from 'unconfig';
// import { sourcePackageJsonFields } from 'unconfig/presets';
import { MpWeixinConfig } from './platform';
import { WecomConfig, DingtalkConfig } from './im';
import { loadJson } from './utils';

export type { Options as PRetryOptions } from 'p-retry';
export type { Options as GotOptions } from 'got';

export interface UniDeployConfig {
  cwd?: string;
  platform?: {
    'mp-weixin'?: MpWeixinConfig;
  };
  im?: {
    wecom?: WecomConfig;
    dingtalk?: DingtalkConfig;
  };
  [key: string]: any;
}

export const defaultCwd = process.cwd();

export const defaultConfig: UniDeployConfig = {
  cwd: defaultCwd,
};

export function defineConfig(config: UniDeployConfig) {
  return config;
}

export function mergeConfig(config: UniDeployConfig) {
  return {
    ...defaultConfig,
    ...config,
  };
}

// export async function loadConfig(
//   options?: Partial<UnconfigLoadConfigOptions>,
// ): Promise<{ path?: string; data?: UniDeployConfig }> {
//   const { config, sources } = await unconfigLoadConfig<UniDeployConfig>({
//     sources: [
//       {
//         files: 'uni-deploy.config',
//       },
//       sourcePackageJsonFields({
//         fields: ['uni-deploy'],
//       }),
//     ],
//     ...options,
//   });
//   return {
//     path: sources[0],
//     data: config,
//   };
// }

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
