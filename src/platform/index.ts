import { mpWeixinUpload, mpWeixinPreview, mpWeixinValidate } from './mp-weixin';
import type {
  UniDeployConfig,
  PRetryOptions,
  Platform,
  PlatformTextMap,
  PlatformValidateMap,
  PlatformUploadMap,
  PlatformPreviewMap,
  PlatformValidate,
  PlatformUpload,
  PlatformPreview,
} from '../types';

export * from './mp-weixin';

export const platforms: Platform[] = ['mp-weixin'];

export const platformMap: PlatformTextMap = {
  'mp-weixin': '微信小程序',
};

export const platformValidateMap: PlatformValidateMap = {
  'mp-weixin': mpWeixinValidate,
};

export const platformUploadMap: PlatformUploadMap = {
  'mp-weixin': mpWeixinUpload,
};

export const platformPreviewMap: PlatformPreviewMap = {
  'mp-weixin': mpWeixinPreview,
};

export const platformValidate: PlatformValidate = (config: UniDeployConfig, platform: Platform) =>
  platformValidateMap[platform](config);

export const platformUpload: PlatformUpload = (
  config: UniDeployConfig,
  platform: Platform,
  pRetryOptions?: PRetryOptions,
) => platformUploadMap[platform](config, pRetryOptions);

export const platformPreview: PlatformPreview = (
  config: UniDeployConfig,
  platform: Platform,
  pRetryOptions?: PRetryOptions,
) => platformPreviewMap[platform](config, pRetryOptions);
