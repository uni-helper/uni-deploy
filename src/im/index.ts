import { dingtalkNotifyUpload, dingtalkNotifyPreview, dingtalkValidate } from './dingtalk';
import { wecomNotifyUpload, wecomNotifyPreview, wecomValidate } from './wecom';
import type {
  UniDeployConfig,
  Im,
  ImValidateMap,
  ImNotifyUploadMap,
  ImNotifyPreviewMap,
  ImNotifyUpload,
  ImNotifyPreview,
  ImValidate,
} from '../types';

export * from './dingtalk';
export * from './wecom';

export const ims: Im[] = ['dingtalk', 'wecom'];

export const imValidateMap: ImValidateMap = {
  wecom: wecomValidate,
  dingtalk: dingtalkValidate,
};

export const imNotifyUploadMap: ImNotifyUploadMap = {
  wecom: wecomNotifyUpload,
  dingtalk: dingtalkNotifyUpload,
};

export const imNotifyPreviewMap: ImNotifyPreviewMap = {
  wecom: wecomNotifyPreview,
  dingtalk: dingtalkNotifyPreview,
};

export const imValidate: ImValidate = (config: UniDeployConfig, im: Im) =>
  imValidateMap[im](config);

export const imNotifyUpload: ImNotifyUpload = (config, im, platform, result, buildGotOptions) =>
  imNotifyUploadMap[im](
    config,
    platform,
    result,
    buildGotOptions ? (c, p, r) => buildGotOptions(c, im, p, r) : undefined,
  );

export const imNotifyPreview: ImNotifyPreview = (config, im, platform, result, buildGotOptions) => {
  return imNotifyPreviewMap[im](
    config,
    platform,
    result,
    buildGotOptions ? (c, p, r) => buildGotOptions(c, im, p, r) : undefined,
  );
};
