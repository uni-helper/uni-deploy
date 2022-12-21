import ci from 'miniprogram-ci';
import pRetry from 'p-retry';
import { MiniProgramCI } from 'miniprogram-ci/dist/@types/types';
import { getFileField, getFileDir, getFilePath, logger } from '../utils';
import type { ICreateProjectOptions } from 'miniprogram-ci/dist/@types/ci/project';
import type { IInnerUploadOptions, IInnerUploadResult } from 'miniprogram-ci/dist/@types/ci/upload';
import type { UniDeployConfig, PRetryOptions } from '../config';

export interface MpWeixinConfig {
  /** 用于 miniprogram-ci ci.project */
  project?: Partial<ICreateProjectOptions>;
  /** 用于 miniprogram-ci ci.upload */
  upload?: Partial<Omit<IInnerUploadOptions, 'project'>>;
  /** 用于 miniprogram-ci ci.preview */
  preview?: Partial<Omit<IInnerUploadOptions, 'project' | 'test'> & { test?: true }>;
}

export function mpWeixinGetConfig(config: UniDeployConfig) {
  return config?.['mp-weixin'];
}

export function mpWeixinGetProjectAppid(config: UniDeployConfig) {
  return (config?.['mp-weixin']?.project?.appid ??
    getFileField(config, [
      { entry: ['dist', 'mp-weixin', 'project.config.json'], prop: 'appid' },
      { entry: ['dist', 'build', 'mp-weixin', 'project.config.json'], prop: 'appid' },
      { entry: ['dist', '**', 'mp-weixin', 'project.config.json'], prop: 'appid' },
    ])) as string;
}

export function mpWeixinGetProjectPath(config: UniDeployConfig) {
  return (
    config?.['mp-weixin']?.project?.projectPath ??
    getFileDir(config, [
      { entry: ['dist', 'mp-weixin', 'project.config.json'] },
      { entry: ['dist', 'build', 'mp-weixin', 'project.config.json'] },
      { entry: ['dist', '**', 'mp-weixin', 'project.config.json'] },
    ])
  );
}

export function mpWeixinGetProjectPrivateKeyPath(config: UniDeployConfig) {
  const appid = mpWeixinGetProjectAppid(config);
  return (
    config?.['mp-weixin']?.project?.privateKeyPath ??
    getFilePath(config, [
      { entry: ['**', `private.${appid}.key`] },
      { entry: ['**', `weixin.${appid}.key`] },
      { entry: ['**', `wechat.${appid}.key`] },
    ])
  );
}

export function mpWeixinGetProjectType(config: UniDeployConfig) {
  return config?.['mp-weixin']?.project?.type ?? 'miniProgram';
}

export function mpWeixinValidate(config: UniDeployConfig) {
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
}

export function mpWeixinCreateProject(config: UniDeployConfig) {
  const project = new ci.Project({
    ...config?.['mp-weixin']?.project,
    appid: mpWeixinGetProjectAppid(config),
    projectPath: mpWeixinGetProjectPath(config),
    privateKeyPath: mpWeixinGetProjectPrivateKeyPath(config),
    type: mpWeixinGetProjectType(config),
  });
  return project;
}

export function mpWeixinGetUploadVersion(config: UniDeployConfig) {
  return (config?.['mp-weixin']?.upload?.version ??
    getFileField(config, [
      { entry: 'package.json', prop: 'version' },
      { entry: ['src', 'manifest.json'], prop: ['versionName'] },
      { entry: ['**', 'manifest.json'], prop: ['versionName'] },
    ])) as string;
}

export function mpWeixinGetUploadSetting(config: UniDeployConfig) {
  return (config?.['mp-weixin']?.upload?.setting ??
    getFileField(config, [
      { entry: ['dist', 'mp-weixin', 'project.config.json'], prop: ['setting'] },
      { entry: ['dist', 'build', 'mp-weixin', 'project.config.json'], prop: ['setting'] },
      { entry: ['dist', '**', 'mp-weixin', 'project.config.json'], prop: ['setting'] },
    ])) as MiniProgramCI.ICompileSettings;
}

export function mpWeixinGetUploadDesc(config: UniDeployConfig) {
  return config?.['mp-weixin']?.upload?.desc ?? 'Uploaded by uni-deploy';
}

export async function mpWeixinUpload(
  config: UniDeployConfig,
  pRetryOptions?: PRetryOptions,
): Promise<IInnerUploadResult> {
  return pRetry(
    () =>
      ci.upload({
        ...config?.['mp-weixin']?.upload,
        project: mpWeixinCreateProject(config),
        version: mpWeixinGetUploadVersion(config),
        setting: mpWeixinGetUploadSetting(config),
        desc: mpWeixinGetUploadDesc(config),
      }),
    pRetryOptions,
  );
}

export function mpWeixinGetPreviewVersion(config: UniDeployConfig) {
  return (config?.['mp-weixin']?.preview?.version ??
    getFileField(config, [
      { entry: 'package.json', prop: 'version' },
      { entry: ['src', 'manifest.json'], prop: ['versionName'] },
      { entry: ['**', 'manifest.json'], prop: ['versionName'] },
    ])) as string;
}

export function mpWeixinGetPreviewSetting(config: UniDeployConfig) {
  return (config?.['mp-weixin']?.preview?.setting ??
    getFileField(config, [
      { entry: ['dist', 'mp-weixin', 'project.config.json'], prop: ['setting'] },
      { entry: ['dist', 'build', 'mp-weixin', 'project.config.json'], prop: ['setting'] },
      { entry: ['dist', '**', 'mp-weixin', 'project.config.json'], prop: ['setting'] },
    ])) as MiniProgramCI.ICompileSettings;
}

export function mpWeixinGetPreviewDesc(config: UniDeployConfig) {
  return config?.['mp-weixin']?.preview?.desc ?? 'Uploaded by uni-deploy';
}

export function mpWeixinGetPreviewQrcodeFormat(config: UniDeployConfig) {
  return config?.['mp-weixin']?.preview?.qrcodeFormat ?? 'image';
}

export function mpWeixinGetPreviewQrcodeOutputDest(config: UniDeployConfig) {
  return config?.['mp-weixin']?.preview?.qrcodeOutputDest ?? 'qrcode.png';
}

export async function mpWeixinPreview(config: UniDeployConfig, pRetryOptions?: PRetryOptions) {
  return pRetry(
    () =>
      ci.preview({
        ...config?.['mp-weixin']?.preview,
        project: mpWeixinCreateProject(config),
        version: mpWeixinGetPreviewVersion(config),
        setting: mpWeixinGetPreviewSetting(config),
        desc: mpWeixinGetPreviewDesc(config),
        qrcodeFormat: mpWeixinGetPreviewQrcodeFormat(config),
        qrcodeOutputDest: mpWeixinGetPreviewQrcodeOutputDest(config),
      }),
    pRetryOptions,
  );
}
