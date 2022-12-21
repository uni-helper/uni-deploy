import { extname } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import got from 'got';
import { logger } from '../utils';
import { platformMap } from '../platform';
import type { ExtendOptions as GotOptions } from 'got';
import type { UniDeployConfig } from '../config';
import type { Platform } from '../platform';

export interface DingtalkConfig {
  /** 钉钉机器人 webhook */
  webhook?: string | string[];
}

export function dingtalkGetConfig(config: UniDeployConfig) {
  return config?.dingtalk;
}

export function dingtalkGetWebhook(config: UniDeployConfig) {
  return config?.dingtalk?.webhook ?? '';
}

export function dingtalkValidate(config: UniDeployConfig) {
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
}

export async function dingtalkNotifyUploadResult<T = any>(
  config: UniDeployConfig,
  platform: Platform,
  result: Promise<T> | T,
  imagePath?: string,
  buildGotOptions?: (platform: Platform, result: Promise<T> | T) => GotOptions,
) {
  const webhook = dingtalkGetWebhook(config);
  const res = await result;
  let imageText = '';
  if (imagePath && existsSync(imagePath)) {
    const imageExtension = extname(imagePath);
    const image = readFileSync(imagePath, { encoding: 'base64' });
    const base64 = `data:image/${imageExtension.split('.').pop()};base64,${image}`;
    imageText = `<image src="${base64}" width="128px" height="128px" style="width:128px;height:128px" />`;
  }
  const gotOptions: GotOptions = {
    method: 'POST',
    json: {
      msgtype: 'markdown',
      text: {
        content: [imageText, `${platformMap[platform]}上传完毕。`, `原始响应：${res}`]
          .filter((c) => !!c)
          .join('<br/><br/>'),
      },
    },
    ...buildGotOptions?.(platform, result),
  };
  return Array.isArray(webhook)
    ? Promise.all(webhook.map((w) => got(w, gotOptions)))
    : got(webhook, gotOptions);
}

export async function dingtalkNotifyPreviewResult<T = any>(
  config: UniDeployConfig,
  platform: Platform,
  result: Promise<T> | T,
  imagePath?: string,
  buildGotOptions?: (platform: Platform, result: Promise<T> | T) => GotOptions,
) {
  const webhook = dingtalkGetWebhook(config);
  const res = await result;
  let imageText = '';
  if (imagePath && existsSync(imagePath)) {
    const imageExtension = extname(imagePath);
    const image = readFileSync(imagePath, { encoding: 'base64' });
    const base64 = `data:image/${imageExtension.split('.').pop()};base64,${image}`;
    imageText = `<image src="${base64}" width="128px" height="128px" style="width:128px;height:128px" />`;
  }
  const gotOptions: GotOptions = {
    method: 'POST',
    json: {
      msgtype: 'markdown',
      text: {
        content: [imageText, `${platformMap[platform]}预览完毕。`, `原始响应：${res}`]
          .filter((c) => !!c)
          .join('<br/><br/>'),
      },
    },
    ...buildGotOptions?.(platform, result),
  };
  return Array.isArray(webhook)
    ? Promise.all(webhook.map((w) => got(w, gotOptions)))
    : got(webhook, gotOptions);
}
