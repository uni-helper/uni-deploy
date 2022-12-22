import type { ICreateProjectOptions } from 'miniprogram-ci/dist/@types/ci/project';
import type { IInnerUploadOptions } from 'miniprogram-ci/dist/@types/ci/upload';

import type { Options as PRetryOptions } from 'p-retry';
import type { ExtendOptions as GotOptions } from 'got';
import type { Options as JoyConOptions } from 'joycon';

export { PRetryOptions, GotOptions, JoyConOptions };

export type Platform = 'mp-weixin';
export type PlatformTextMap = Record<Platform, string>;
export interface PlatformConfig {
  upload?: Record<string, any>;
  preview?: Record<string, any>;
}
export interface MpWeixinConfig extends PlatformConfig {
  /** 用于 miniprogram-ci ci.project */
  project?: Partial<ICreateProjectOptions>;
  /** 用于 miniprogram-ci ci.upload */
  upload?: Partial<Omit<IInnerUploadOptions, 'project'>>;
  /** 用于 miniprogram-ci ci.preview */
  preview?: Partial<Omit<IInnerUploadOptions, 'project' | 'test'> & { test?: true }>;
}
export interface PlatformValidate {
  (config: UniDeployConfig, platform: Platform): boolean;
}
export interface SpecificPlatformValidate {
  (config: UniDeployConfig): boolean;
}
export type PlatformValidateMap = Record<Platform, SpecificPlatformValidate>;
export interface PlatformUpload {
  (config: UniDeployConfig, platform: Platform, pRetryOptions?: PRetryOptions): Promise<any>;
}
export interface SpecificPlatformUpload {
  (config: UniDeployConfig, pRetryOptions?: PRetryOptions): Promise<any>;
}
export type PlatformUploadMap = Record<Platform, SpecificPlatformUpload>;
export interface PlatformPreview {
  (config: UniDeployConfig, platform: Platform, pRetryOptions?: PRetryOptions): Promise<any>;
}
export interface SpecificPlatformPreview {
  (config: UniDeployConfig, pRetryOptions?: PRetryOptions): Promise<any>;
}
export type PlatformPreviewMap = Record<Platform, SpecificPlatformPreview>;

export type Im = 'wecom' | 'dingtalk';
export interface ImConfig {
  /** 机器人 webhook */
  webhook?: string | string[];
}
export interface WecomConfig extends ImConfig {}
export interface DingtalkConfig extends ImConfig {}
export interface ImValidate {
  (config: UniDeployConfig, im: Im): boolean;
}
export interface SpecificImValidate {
  (config: UniDeployConfig): boolean;
}
export type ImValidateMap = Record<Im, SpecificImValidate>;
export interface ImNotifyUploadBuildGotOptions {
  (config: UniDeployConfig, im: Im, platform: Platform, result: Promise<any> | any): GotOptions;
}
export interface ImNotifyUpload {
  (
    config: UniDeployConfig,
    im: Im,
    platform: Platform,
    result: Promise<any> | any,
    buildGotOptions?: ImNotifyUploadBuildGotOptions,
  ): Promise<any>;
}
export interface SpecificImNotifyUploadBuildGotOptions {
  (config: UniDeployConfig, platform: Platform, result: Promise<any> | any): GotOptions;
}
export interface SpecificImNotifyUpload {
  (
    config: UniDeployConfig,
    platform: Platform,
    result: Promise<any> | any,
    buildGotOptions?: SpecificImNotifyUploadBuildGotOptions,
  ): Promise<any>;
}
export type ImNotifyUploadMap = Record<Im, SpecificImNotifyUpload>;
export interface ImNotifyPreviewBuildGotOptions {
  (config: UniDeployConfig, im: Im, platform: Platform, result: Promise<any> | any): GotOptions;
}
export interface ImNotifyPreview {
  (
    config: UniDeployConfig,
    im: Im,
    platform: Platform,
    result: Promise<any> | any,
    buildGotOptions?: ImNotifyPreviewBuildGotOptions,
  ): Promise<any>;
}
export interface SpecificImNotifyPreviewBuildGotOptions {
  (config: UniDeployConfig, platform: Platform, result: Promise<any> | any): GotOptions;
}
export interface SpecificImNotifyPreview {
  (
    config: UniDeployConfig,
    platform: Platform,
    result: Promise<any> | any,
    buildGotOptions?: SpecificImNotifyPreviewBuildGotOptions,
  ): Promise<any>;
}
export type ImNotifyPreviewMap = Record<Im, SpecificImNotifyPreview>;

export interface UniDeployConfig {
  cwd: string;
  'mp-weixin'?: MpWeixinConfig;
  wecom?: WecomConfig;
  dingtalk?: DingtalkConfig;
  [key: string]: any;
}
export interface UniDeployUserConfig extends Partial<UniDeployConfig> {}