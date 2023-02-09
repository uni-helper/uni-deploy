import { existsSync } from 'node:fs';
import ci from 'miniprogram-ci';
import pRetry from 'p-retry';
import { ICreateProjectOptions as WechatCreateProjectOptions } from 'miniprogram-ci/dist/@types/ci/project';
import { IInnerUploadOptions as WechatUploadOptions } from 'miniprogram-ci/dist/@types/ci/upload';
import type { IInnerUploadResult as WechatUploadResult } from 'miniprogram-ci/dist/@types/ci/upload';
import { logger } from '../utils';
import type { UniDeployConfig, PRetryOptions } from '../types';

export const mpWeixinValidate = (config: UniDeployConfig) => {
  let isValid = true;
  /* appid */
  const appid = config['mp-weixin']?.appid;
  if (!appid) {
    logger.warn('【微信小程序】缺少 appid');
    isValid = false;
  }
  /* projectPath */
  const projectPath = config?.['mp-weixin']?.projectPath;
  if (!projectPath) {
    logger.warn('【微信小程序】缺少 projectPath');
    isValid = false;
  }
  /* privateKey & privateKeyPath */
  const privateKey = config?.['mp-weixin']?.privateKey;
  const privateKeyPath = config?.['mp-weixin']?.privateKeyPath;
  if (!privateKey && !privateKeyPath) {
    logger.warn('【微信小程序】缺少 privateKey');
    isValid = false;
  }
  if (!privateKey && privateKeyPath && !existsSync(privateKeyPath)) {
    logger.warn('【微信小程序】privateKeyPath 没有对应文件');
    isValid = false;
  }
  /* version */
  const version = config?.['mp-weixin']?.version;
  if (!version) {
    logger.warn('【微信小程序】缺少 version');
    isValid = false;
  }
  return isValid;
};

export const mpWeixinGetProject = (config: UniDeployConfig) =>
  new ci.Project({
    ...config?.['mp-weixin'],
  } as WechatCreateProjectOptions);

export const mpWeixinUpload = async (config: UniDeployConfig, pRetryOptions?: PRetryOptions) =>
  pRetry(
    () =>
      ci.upload({
        ...config?.['mp-weixin'],
        project: mpWeixinGetProject(config),
      } as WechatUploadOptions),
    pRetryOptions,
  ) as Promise<WechatUploadResult>;

export const mpWeixinPreview = async (config: UniDeployConfig, pRetryOptions?: PRetryOptions) =>
  pRetry(
    () =>
      ci.preview({
        ...config?.['mp-weixin'],
        project: mpWeixinGetProject(config),
      } as WechatUploadOptions & { test?: true }),
    pRetryOptions,
  );
