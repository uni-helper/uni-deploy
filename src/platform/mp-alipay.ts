import * as _mindev from 'minidev';
import pRetry from 'p-retry';
import { PRetryOptions, UniDeployConfig } from 'src/types';
import { getFileField, getFileDir, logger } from '../utils';

const { minidev, useDefaults } = _mindev;

export const mpAlipayGetConfig = (config: UniDeployConfig) => config?.['mp-alipay'];

export const mpAlipayGetProjectAppid = (config: UniDeployConfig) =>
  (config?.['mp-alipay']?.project?.appid ??
    getFileField(config, [
      { entry: ['dist', 'mp-alipay', 'mini.project.json'], prop: 'appid' },
      { entry: ['dist', 'build', 'mp-alipay', 'mini.project.json'], prop: 'appid' },
      { entry: ['dist', '**', 'mp-alipay', 'mini.project.json'], prop: 'appid' },
    ])) as string;

export const mpAlipayGetProjectPath = (config: UniDeployConfig) =>
  config?.['mp-alipay']?.project?.projectPath ??
  getFileDir(config, [
    { entry: ['dist', 'mp-alipay', 'mini.project.json'] },
    { entry: ['dist', 'build', 'mp-alipay', 'mini.project.json'] },
    { entry: ['dist', '**', 'mp-alipay', 'mini.project.json'] },
  ]);

export const mpAlipayGetProjectPrivateKey = (config: UniDeployConfig) =>
  config?.['mp-alipay']?.project?.privateKey ??
  getFileField(config, [
    { entry: ['~', '.minidev', 'config.json'], prop: ['alipay', 'authentication', 'privateKey'] },
    { entry: ['~', '.minidev', 'config.json'], prop: ['authentication', 'privateKey'] },
  ]);

export const mpAlipayGetProjectToolId = (config: UniDeployConfig) =>
  config?.['mp-alipay']?.project?.toolId ??
  getFileField(config, [
    { entry: ['~', '.minidev', 'config.json'], prop: ['alipay', 'authentication', 'toolId'] },
    { entry: ['~', '.minidev', 'config.json'], prop: ['authentication', 'toolId'] },
  ]);

export const mpAlipayValidate = (config: UniDeployConfig) => {
  const mpAlipayConfig = mpAlipayGetConfig(config);
  if (!mpAlipayConfig) {
    logger.info('没有配置支付宝小程序，跳过支付宝小程序操作。');
    return false;
  }
  const appid = mpAlipayGetProjectAppid(config);
  if (!appid) {
    logger.info('没有配置支付宝小程序 appid，跳过支付宝小程序操作。');
    return false;
  }
  const privateKey = mpAlipayGetProjectPrivateKey(config);
  if (!privateKey) {
    logger.info('没有配置支付宝小程序 privateKey，跳过支付宝小程序操作。');
    return false;
  }
  const toolId = mpAlipayGetProjectToolId(config);
  if (!toolId) {
    logger.info('没有配置支付宝小程序 toolId，跳过支付宝小程序操作。');
    return false;
  }
  return true;
};

export const mpAlipayGetProject = (config: UniDeployConfig) =>
  useDefaults({
    config: {
      defaults: {
        'alipay.authentication.privateKey': mpAlipayGetProjectPrivateKey(config),
        'alipay.authentication.toolId': mpAlipayGetProjectToolId(config),
      },
    },
  });

export const mpAlipayUpload = async (config: UniDeployConfig, pRetryOptions?: PRetryOptions) => {
  mpAlipayGetProject(config);
  return pRetry(
    () =>
      minidev.upload({
        ...config?.['mp-alipay']?.upload,
        appId: mpAlipayGetProjectAppid(config),
        project: mpAlipayGetProjectPath(config),
      }),
    pRetryOptions,
  );
};

export const mpAlipayPreview = async (config: UniDeployConfig, pRetryOptions?: PRetryOptions) => {
  mpAlipayGetProject(config);
  return pRetry(
    () =>
      minidev.preview({
        ...config?.['mp-alipay']?.preview,
        appId: mpAlipayGetProjectAppid(config),
        project: mpAlipayGetProjectPath(config),
      }),
    pRetryOptions,
  );
};
