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

export const dingtalkValidate = (config: UniDeployConfig) => {
  let isValid = true;
  /* webhook */
  const webhook = config?.dingtalk?.webhook;
  if (!webhook || (Array.isArray(webhook) && webhook.length === 0)) {
    logger.warn('【钉钉】缺少 webhook');
    isValid = false;
  }
  return isValid;
};

export const dingtalkNotifyUpload = async (
  config: UniDeployConfig,
  platform: Platform,
  result: Promise<any> | any,
  buildGotOptions?: SpecificImNotifyUploadBuildGotOptions,
) => {
  const webhook = config?.dingtalk?.webhook as string | string[];
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
  const webhook = config?.dingtalk?.webhook as string | string[];
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
