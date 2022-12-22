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

export const dingtalkGetConfig = (config: UniDeployConfig) => config?.dingtalk;

export const dingtalkGetWebhook = (config: UniDeployConfig) => config?.dingtalk?.webhook ?? '';

export const dingtalkValidate = (config: UniDeployConfig) => {
  const dingtalkConfig = dingtalkGetConfig(config);
  if (!dingtalkConfig) {
    logger.info('没有配置钉钉，跳过钉钉操作。');
    return false;
  }
  const webhook = dingtalkGetWebhook(config);
  if (!webhook || (Array.isArray(webhook) && webhook.length === 0)) {
    logger.info('没有配置钉钉机器人 webhook，跳过钉钉操作。');
    return false;
  }
  return true;
};

export const dingtalkNotifyUpload = async (
  config: UniDeployConfig,
  platform: Platform,
  result: Promise<any> | any,
  buildGotOptions?: SpecificImNotifyUploadBuildGotOptions,
) => {
  const webhook = dingtalkGetWebhook(config);
  const res = await result;
  const gotOptions: GotOptions = {
    method: 'POST',
    json: {
      msgtype: 'markdown',
      text: {
        content: `${platformMap[platform]}上传完毕。<br/><br/>原始响应：${res}`,
      },
    },
    ...buildGotOptions?.(config, platform, result),
  };
  return Array.isArray(webhook)
    ? Promise.all(webhook.map((w) => got(w, gotOptions)))
    : got(webhook, gotOptions);
};

export const dingtalkNotifyPreview = async (
  config: UniDeployConfig,
  platform: Platform,
  result: Promise<any> | any,
  buildGotOptions?: SpecificImNotifyPreviewBuildGotOptions,
) => {
  const webhook = dingtalkGetWebhook(config);
  const res = await result;
  const gotOptions: GotOptions = {
    method: 'POST',
    json: {
      msgtype: 'markdown',
      text: {
        content: `${platformMap[platform]}预览完毕。<br/><br/>原始响应：${res}`,
      },
    },
    ...buildGotOptions?.(config, platform, result),
  };
  return Array.isArray(webhook)
    ? Promise.all(webhook.map((w) => got(w, gotOptions)))
    : got(webhook, gotOptions);
};
