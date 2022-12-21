import { mpWeixinUpload, mpWeixinPreview, mpWeixinValidate } from './mp-weixin';
import type { UniDeployConfig, PRetryOptions } from '../config';

export * from './mp-weixin';

export const platforms = ['mp-weixin'] as const;

export const platformMap = {
  'mp-weixin': '微信小程序',
};

export type Platform = typeof platforms[number];

export const platformValidateMap = {
  'mp-weixin': mpWeixinValidate,
};

export const platformUploadMap = {
  'mp-weixin': mpWeixinUpload,
};

export const platformPreviewMap = {
  'mp-weixin': mpWeixinPreview,
};

export function platformValidate(config: UniDeployConfig, platform: Platform) {
  return platformValidateMap[platform](config);
}

export function platformUpload(
  config: UniDeployConfig,
  platform: Platform,
  pRetryOptions?: PRetryOptions,
) {
  return platformUploadMap[platform](config, pRetryOptions);
}

export function platformPreview(
  config: UniDeployConfig,
  platform: Platform,
  pRetryOptions?: PRetryOptions,
) {
  return platformPreviewMap[platform](config, pRetryOptions);
}
