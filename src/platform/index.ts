import { mpWeixinUpload, mpWeixinPreview, mpWeixinValidate } from './mp-weixin';
import { mpAlipayUpload, mpAlipayPreview, mpAlipayValidate } from './mp-alipay';
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
export * from './mp-alipay';

export const platforms: Platform[] = ['mp-weixin', 'mp-alipay'];

export const platformMap: PlatformTextMap = {
  'mp-weixin': '微信小程序',
  'mp-alipay': '支付宝小程序',
};

export const platformValidateMap: PlatformValidateMap = {
  'mp-weixin': mpWeixinValidate,
  'mp-alipay': mpAlipayValidate,
};

export const platformUploadMap: PlatformUploadMap = {
  'mp-weixin': mpWeixinUpload,
  'mp-alipay': mpAlipayUpload,
};

export const platformPreviewMap: PlatformPreviewMap = {
  'mp-weixin': mpWeixinPreview,
  'mp-alipay': mpAlipayPreview,
};

export const platformValidate: PlatformValidate = (config: UniDeployConfig, platform: Platform) =>
  platformValidateMap[platform](config);

export const platformsValidate = (config: UniDeployConfig) =>
  platforms.map((platform) => platformValidate(config, platform));

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
