import * as _mindev from 'minidev';
import pRetry from 'p-retry';
import { PRetryOptions, UniDeployConfig } from '../types';
import { logger } from '../utils';

const { minidev, useDefaults } = _mindev;

export const mpAlipayValidate = (config: UniDeployConfig) => {
  let isValid = true;
  /* appid */
  const appid = config?.['mp-alipay']?.appid;
  if (!appid) {
    logger.warn('【支付宝小程序】缺少 appid');
    isValid = false;
  }
  /* projectPath */
  const projectPath = config?.['mp-alipay']?.projectPath;
  if (!projectPath) {
    logger.warn('【支付宝小程序】缺少 projectPath');
    isValid = false;
  }
  /* privateKey */
  const privateKey = config?.['mp-alipay']?.privateKey;
  if (!privateKey) {
    logger.warn('【支付宝小程序】缺少 privateKey');
    isValid = false;
  }
  /* toolId */
  const toolId = config?.['mp-alipay']?.toolId;
  if (!toolId) {
    logger.warn('【支付宝小程序】缺少 toolId');
    isValid = false;
  }
  /* version */
  const version = config?.['mp-alipay']?.version;
  if (!version) {
    logger.warn('【支付宝小程序】缺少 version');
    isValid = false;
  }
  return isValid;
};

export const mpAlipayGetProject = (config: UniDeployConfig) =>
  useDefaults({
    config: {
      defaults: {
        'alipay.authentication.privateKey': config?.['mp-alipay']?.privateKey,
        'alipay.authentication.toolId': config?.['mp-alipay']?.toolId,
      },
    },
  });

export const mpAlipayUpload = async (config: UniDeployConfig, pRetryOptions?: PRetryOptions) => {
  mpAlipayGetProject(config);
  return pRetry(
    () =>
      minidev.upload({
        ...config?.['mp-alipay'],
        appId: config?.['mp-alipay']?.appid as string,
        project: config?.['mp-alipay']?.projectPath,
      }),
    pRetryOptions,
  );
};

export const mpAlipayPreview = async (config: UniDeployConfig, pRetryOptions?: PRetryOptions) => {
  mpAlipayGetProject(config);
  return pRetry(
    () =>
      minidev.preview({
        ...config?.['mp-alipay'],
        appId: config?.['mp-alipay']?.appid as string,
        project: config?.['mp-alipay']?.projectPath,
      }),
    pRetryOptions,
  );
};
