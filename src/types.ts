import type { MiniProgramCI as Wechat } from 'miniprogram-ci/dist/@types/types';
import type { EBuildTarget as AlipayBuildTarget } from 'minidev';

import type { Options as PRetryOptions } from 'p-retry';
import type { ExtendOptions as GotOptions } from 'got';

export { PRetryOptions, GotOptions };

export type Platform = 'mp-weixin' | 'mp-alipay';
export type PlatformTextMap = Record<Platform, string>;
export interface MpWeixinConfig {
  /** 会尝试搜索 project.config.json 和 manifest.json 并将其中微信小程序字段的 appid 作为默认值 */
  appid?: string;
  /** 会尝试搜索 project.config.json 并将其目录作为默认值 */
  projectPath?: string;
  /** @deprecated 不建议使用，建议在 .env 或 process.env 设置 MP_WEIXIN_PRIVATE_KEY */
  privateKey?: string;
  /** @deprecated 不建议使用，建议在 .env 或 process.env 设置 MP_WEIXIN_PRIVATE_KEY_PATH */
  privateKeyPath?: string;
  /** 默认为 miniProgram */
  type?: Wechat.ProjectType;
  ignores?: string[];
  /**
   * 会尝试搜索 package.json 和 manifest.json，并将 version (package.json) 或 versionName (manifest.json)
   * 作为默认值
   */
  version?: string;
  /** 会尝试搜索 project.config.json，并将 setting 作为默认值 */
  setting?: Wechat.ICompileSettings;
  /** 默认为 Handled by uni-deploy */
  desc?: string;
  /** 使用的机器人，可选 1 - 30 */
  robot?: number;
  /** 编译过程中开启的线程数 */
  threads?: number;
  /** 是否使用异步方式上传，当代码包大于 5MB 时，默认开启 */
  useCOS?: boolean;
  /** 是否允许过滤无依赖文件，默认开启 */
  allowIgnoreUnusedFiles?: boolean;
  /** 进度更新监听函数 */
  onProgressUpdate?: (task: Wechat.ITaskStatus | string) => void;
  /** 预览时主包、分包体积上限是否调整为4M */
  bigPackageSizeSupport?: boolean;
  /** 二维码文件的格式，默认为 image */
  qrcodeFormat?: 'base64' | 'image' | 'terminal';
  /** 二维码文件保存路径，默认为 qrcode.png */
  qrcodeOutputDest?: string;
  /** 预览页面路径 */
  pagePath?: string;
  /** 预览页面路径启动参数 */
  searchQuery?: string;
  /** 默认值 1011，具体含义见 https://developers.weixin.qq.com/miniprogram/dev/reference/scene-list.html */
  scene?: number;
  test?: boolean;
}
export interface MpAlipayConfig {
  /**
   * 会尝试搜索 mini.project.json 和 manifest.json，并将 appid (mini.project.json) 或 mp-alipay.appid
   * (manifest.json) 作为默认值
   */
  appid?: string;
  /** 会尝试搜索 mini.project.json 并将其目录作为默认值 */
  projectPath?: string;
  /** @deprecated 不建议使用，建议在 .env 或 process.env 设置 MP_ALIPAY_PRIVATE_KEY */
  privateKey?: string;
  /** @deprecated 不建议使用，建议在 .env 或 process.env 设置 MP_ALIPAY_TOOL_ID */
  toolId?: string;
  /** 端类型 */
  clientType?: string;
  /** 开放平台 bundleId, 此项会覆盖 clientType 的效果 */
  bundleId?: string;
  /**
   * 会尝试搜索 package.json 和 manifest.json，并将 version (package.json) 或 versionName (manifest.json)
   * 作为默认值
   */
  version?: string;
  /** 上传成功后是否自动设置为体验版本，需要对应权限 */
  experience?: boolean;
  /** 上传时需要删除的版本号 */
  deleteVersion?: string;
  /** 强制构建类别，默认为 v2 */
  appxv?: 'v1' | 'v2' | 'legacy-v1';
  /** 构建缓存路径, 默认为系统缓存路径 */
  cacheDir?: string;
  /** 产物路径 */
  output?: string;
  /** 是否开启 sourceMap */
  sourceMap?: boolean;
  /** 插件 Id，构建插件时将生成到代码中 */
  pluginId?: string;
  /** 多进程编译 */
  parallel?: boolean;
  /** 是否需要压缩，默认不开 */
  minify?: boolean;
  /** 构建类型 */
  buildTarget?: AlipayBuildTarget;
  /** 是否开启 less 编译 */
  enableLess?: boolean;
  /** 是否开启 ts 编译 */
  enableTypescript?: boolean;
  /** 是否开启紧凑产物模式 */
  compact?: boolean;
  /** 是否忽略 http 请求白名单校验 */
  ignoreHttpDomainCheck?: boolean;
  /** 是否忽略 webview 加载域名白名单校验 */
  ignoreWebViewDomainCheck?: boolean;
  /** 是否自动推送到客户端 */
  autoPush?: boolean;
  /** 自定义启动参数 */
  launchParams?: any;
  /** 移动应用 ID */
  ampeProductId?: string;
  /** 设备 ID */
  ampeDeviceId?: string;
  /** 产品 ID */
  ampeHostAppId?: string;
  /** 入口页面 */
  page?: string;
  /** 页面参数, 可在当前页面的 onLoad 中取得，如: name=vendor&color=black */
  pageQuery?: string;
  /** 全局参数，app.js 的 onLaunch 中取得，如: name=vendor&color=black */
  query?: string;
  /** 场景值 */
  scene?: string;
  /** 模拟更新 */
  simulateUpdate?: boolean;
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
  /** @deprecated 机器人 webhook，建议在 .env 或 process.env 设置 */
  webhook?: string | string[];
}
export interface DingtalkConfig extends ImConfig {
  /** @deprecated 机器人 webhook，建议在 .env 或 process.env 设置 DINGTALK_WEBHOOK */
  webhook?: string | string[];
}
export interface WecomConfig extends ImConfig {
  /** @deprecated 机器人 webhook，建议在 .env 或 process.env 设置 WECOM_WEBHOOK */
  webhook?: string | string[];
}
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
  'mp-alipay'?: MpAlipayConfig;
  dingtalk?: DingtalkConfig;
  wecom?: WecomConfig;
  [key: string]: any;
}
export interface UniDeployUserConfig extends Partial<UniDeployConfig> {}
