import { loadConfig as unLoadConfig } from 'unconfig';
import { MpWeixinConfig } from './platform';
import { WecomConfig, DingtalkConfig } from './im';
import type { LoadConfigOptions } from 'unconfig';

export type { Options as PRetryOptions } from 'p-retry';
export type { Options as GotOptions } from 'got';

export interface UniAppDeployConfig {
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

export const defaultConfig: UniAppDeployConfig = {
  cwd: defaultCwd,
};

export function defineConfig(config: UniAppDeployConfig) {
  return config;
}

export function mergeConfig(config: UniAppDeployConfig) {
  return {
    ...defaultConfig,
    ...config,
  };
}

export const loadConfig = async (options: Partial<LoadConfigOptions> = {}) => {
  const { config, sources } = await unLoadConfig({
    sources: [
      {
        files: ['uni-deploy.config'],
      },
      {
        files: 'package.json',
        extensions: [],
        rewrite: (config: any) => {
          return config?.['uni-deploy'];
        },
      },
    ],
    merge: false,
    ...options,
  });
  return {
    path: sources[0] as string | undefined,
    data: config as UniAppDeployConfig | undefined,
  };
};
