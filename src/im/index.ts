import { UniDeployConfig, GotOptions } from '../config';
import {
  dingtalkNotifyUploadResult,
  dingtalkNotifyPreviewResult,
  dingtalkValidate,
} from './dingtalk';
import { wecomNotifyUploadResult, wecomNotifyPreviewResult, wecomValidate } from './wecom';
export * from './dingtalk';
export * from './wecom';

export const ims = ['wecom'] as const;

export type Im = typeof ims[number];

export const imValidateMap = {
  wecom: wecomValidate,
  dingtalk: dingtalkValidate,
};

export const imNotifyUploadResultMap = {
  wecom: wecomNotifyUploadResult,
  dingtalk: dingtalkNotifyUploadResult,
};

export const imNotifyPreviewResultMap = {
  wecom: wecomNotifyPreviewResult,
  dingtalk: dingtalkNotifyPreviewResult,
};

export function imValidate(config: UniDeployConfig, { im }: { im: Im }) {
  return imValidateMap[im](config);
}

export function imNotifyUploadResult(
  config: UniDeployConfig,
  {
    im,
    result,
    buildGotOptions,
  }: {
    im: Im;
    result: any;
    buildGotOptions?: <T>(result: Promise<T> | T) => GotOptions;
  },
) {
  return imNotifyUploadResultMap[im](config, { result, buildGotOptions });
}

export function imNotifyPreviewResult(
  config: UniDeployConfig,
  {
    im,
    result,
    buildGotOptions,
  }: {
    im: Im;
    result: any;
    buildGotOptions?: <T>(result: Promise<T> | T) => GotOptions;
  },
) {
  return imNotifyPreviewResultMap[im](config, { result, buildGotOptions });
}
