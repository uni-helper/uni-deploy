import ci from 'miniprogram-ci';
import pRetry from 'p-retry';
import { MiniProgramCI } from 'miniprogram-ci/dist/@types/types';
import { getFileField, getFileDir, getFilePath, logger } from '../utils';
import type { UniDeployConfig, PRetryOptions } from '../types';
import type { IInnerUploadResult as WechatUploadResult } from 'miniprogram-ci/dist/@types/ci/upload';

export const mpWeixinGetConfig = (config: UniDeployConfig) => config?.['mp-weixin'];

export const mpWeixinGetProjectAppid = (config: UniDeployConfig) =>
  (config?.['mp-weixin']?.project?.appid ??
    getFileField(config, [
      { entry: ['dist', 'mp-weixin', 'project.config.json'], prop: 'appid' },
      { entry: ['dist', 'build', 'mp-weixin', 'project.config.json'], prop: 'appid' },
      { entry: ['dist', '**', 'mp-weixin', 'project.config.json'], prop: 'appid' },
    ])) as string;

export const mpWeixinGetProjectPath = (config: UniDeployConfig) =>
  config?.['mp-weixin']?.project?.projectPath ??
  getFileDir(config, [
    { entry: ['dist', 'mp-weixin', 'project.config.json'] },
    { entry: ['dist', 'build', 'mp-weixin', 'project.config.json'] },
    { entry: ['dist', '**', 'mp-weixin', 'project.config.json'] },
  ]);

export const mpWeixinGetProjectPrivateKeyPath = (config: UniDeployConfig) => {
  const appid = mpWeixinGetProjectAppid(config);
  return (
    config?.['mp-weixin']?.project?.privateKeyPath ??
    getFilePath(config, [
      { entry: ['**', `private.${appid}.key`] },
      { entry: ['**', `weixin.${appid}.key`] },
      { entry: ['**', `wechat.${appid}.key`] },
    ])
  );
};

export const mpWeixinGetProjectType = (config: UniDeployConfig) =>
  config?.['mp-weixin']?.project?.type ?? 'miniProgram';

export const mpWeixinValidate = (config: UniDeployConfig) => {
  const mpWeixinConfig = mpWeixinGetConfig(config);
  if (!mpWeixinConfig) {
    logger.info('没有配置微信小程序，跳过微信小程序操作。');
    return false;
  }
  const appid = mpWeixinGetProjectAppid(config);
  if (!appid) {
    logger.info('没有配置微信小程序 appid，跳过微信小程序操作。');
    return false;
  }
  return true;
};

export const mpWeixinGetProject = (config: UniDeployConfig) =>
  new ci.Project({
    ...config?.['mp-weixin']?.project,
    appid: mpWeixinGetProjectAppid(config),
    projectPath: mpWeixinGetProjectPath(config),
    privateKeyPath: mpWeixinGetProjectPrivateKeyPath(config),
    type: mpWeixinGetProjectType(config),
  });

export const mpWeixinGetUploadVersion = (config: UniDeployConfig) =>
  (config?.['mp-weixin']?.upload?.version ??
    getFileField(config, [
      { entry: 'package.json', prop: 'version' },
      { entry: ['src', 'manifest.json'], prop: ['versionName'] },
      { entry: ['**', 'manifest.json'], prop: ['versionName'] },
    ])) as string;

export const mpWeixinGetUploadSetting = (config: UniDeployConfig) =>
  (config?.['mp-weixin']?.upload?.setting ??
    getFileField(config, [
      { entry: ['dist', 'mp-weixin', 'project.config.json'], prop: ['setting'] },
      { entry: ['dist', 'build', 'mp-weixin', 'project.config.json'], prop: ['setting'] },
      { entry: ['dist', '**', 'mp-weixin', 'project.config.json'], prop: ['setting'] },
    ])) as MiniProgramCI.ICompileSettings;

export const mpWeixinGetUploadDesc = (config: UniDeployConfig) =>
  config?.['mp-weixin']?.upload?.desc ?? 'Uploaded by uni-deploy';

export const mpWeixinUpload = async (config: UniDeployConfig, pRetryOptions?: PRetryOptions) =>
  pRetry(
    () =>
      ci.upload({
        version: mpWeixinGetUploadVersion(config),
        setting: mpWeixinGetUploadSetting(config),
        desc: mpWeixinGetUploadDesc(config),
        ...config?.['mp-weixin']?.upload,
        project: mpWeixinGetProject(config),
      }),
    pRetryOptions,
  ) as Promise<WechatUploadResult>;

export const mpWeixinGetPreviewVersion = (config: UniDeployConfig) =>
  (config?.['mp-weixin']?.preview?.version ??
    getFileField(config, [
      { entry: 'package.json', prop: 'version' },
      { entry: ['src', 'manifest.json'], prop: ['versionName'] },
      { entry: ['**', 'manifest.json'], prop: ['versionName'] },
    ])) as string;

export const mpWeixinGetPreviewSetting = (config: UniDeployConfig) =>
  (config?.['mp-weixin']?.preview?.setting ??
    getFileField(config, [
      { entry: ['dist', 'mp-weixin', 'project.config.json'], prop: ['setting'] },
      { entry: ['dist', 'build', 'mp-weixin', 'project.config.json'], prop: ['setting'] },
      { entry: ['dist', '**', 'mp-weixin', 'project.config.json'], prop: ['setting'] },
    ])) as MiniProgramCI.ICompileSettings;

export const mpWeixinGetPreviewDesc = (config: UniDeployConfig) =>
  config?.['mp-weixin']?.preview?.desc ?? 'Uploaded by uni-deploy';

export const mpWeixinGetPreviewQrcodeFormat = (config: UniDeployConfig) =>
  config?.['mp-weixin']?.preview?.qrcodeFormat ?? 'image';

export const mpWeixinGetPreviewQrcodeOutputDest = (config: UniDeployConfig) =>
  config?.['mp-weixin']?.preview?.qrcodeOutputDest ?? 'qrcode.png';

export const mpWeixinPreview = async (config: UniDeployConfig, pRetryOptions?: PRetryOptions) =>
  pRetry(
    () =>
      ci.preview({
        version: mpWeixinGetPreviewVersion(config),
        setting: mpWeixinGetPreviewSetting(config),
        desc: mpWeixinGetPreviewDesc(config),
        qrcodeFormat: mpWeixinGetPreviewQrcodeFormat(config),
        qrcodeOutputDest: mpWeixinGetPreviewQrcodeOutputDest(config),
        ...config?.['mp-weixin']?.preview,
        project: mpWeixinGetProject(config),
      }),
    pRetryOptions,
  );
