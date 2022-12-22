import got from 'got';
import { logger } from '../utils';
import { platformMap } from '../platform';
import type {
  UniDeployConfig,
  Platform,
  GotOptions,
  SpecificImNotifyUploadBuildGotOptions,
  SpecificImNotifyPreviewBuildGotOptions,
} from '../types';

export const wecomGetConfig = (config: UniDeployConfig) => config?.wecom;

export const wecomGetWebhook = (config: UniDeployConfig) => config?.wecom?.webhook ?? '';

export function wecomValidate(config: UniDeployConfig) {
  const wecomConfig = wecomGetConfig(config);
  if (!wecomConfig) {
    logger.info('没有配置企业微信，跳过企业微信操作。');
    return false;
  }
  const webhook = wecomGetWebhook(config);
  if (!webhook || (Array.isArray(webhook) && webhook.length === 0)) {
    logger.info('没有配置企业微信机器人 webhook，跳过企业微信操作。');
    return false;
  }
  return true;
}

export const wecomNotifyUpload = async (
  config: UniDeployConfig,
  platform: Platform,
  result: Promise<any> | any,
  buildGotOptions?: SpecificImNotifyUploadBuildGotOptions,
) => {
  const webhook = wecomGetWebhook(config);
  const res = await result;
  const gotOptions: GotOptions = {
    method: 'POST',
    json: {
      msgtype: 'markdown',
      markdown: {
        content: `${platformMap[platform]}上传完毕。<br/><br/>原始响应：${res}`,
      },
    },
    ...buildGotOptions?.(config, platform, result),
  };
  return Array.isArray(webhook)
    ? Promise.all(webhook.map((w) => got(w, gotOptions)))
    : got(webhook, gotOptions);
};

export const wecomNotifyPreview = async (
  config: UniDeployConfig,
  platform: Platform,
  result: Promise<any> | any,
  buildGotOptions?: SpecificImNotifyPreviewBuildGotOptions,
) => {
  const webhook = wecomGetWebhook(config);
  const res = await result;
  const gotOptions: GotOptions = {
    method: 'POST',
    json: {
      msgtype: 'markdown',
      markdown: {
        content: `${platformMap[platform]}预览完毕。<br/><br/>原始响应：${res}`,
      },
    },
    ...buildGotOptions?.(config, platform, result),
  };
  return Array.isArray(webhook)
    ? Promise.all(webhook.map((w) => got(w, gotOptions)))
    : got(webhook, gotOptions);
};
