import { loadConfig as _loadConfig } from 'unconfig';
import { sourcePackageJsonFields } from 'unconfig/presets';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { getFileDir, getFileField, getVersionField } from './utils';
import type { UniDeployConfig, UniDeployUserConfig } from './types';
import type { MiniProgramCI as Wechat } from 'miniprogram-ci/dist/@types/types';

export const defaultConfig: UniDeployConfig = {
  cwd: process.cwd(),
};

export const defineConfig = (config: UniDeployUserConfig) => config;

export const loadEnvConfig = () => {
  dotenvExpand.expand(dotenv.config());
  const envConfig = {
    'mp-weixin': {
      privateKey: process.env.MP_WEIXIN_PRIVATE_KEY,
      privateKeyPath: process.env.MP_WEIXIN_PRIVATE_KEY_PATH,
    },
    'mp-alipay': {
      privateKey: process.env.MP_ALIPAY_PRIVATE_KEY,
      toolId: process.env.MP_ALIPAY_TOOL_ID,
    },
    dingtalk: {
      webhook: process.env.DINGTALK_WEBHOOK,
    },
    wecom: {
      webhook: process.env.WECOM_WEBHOOK,
    },
  };
  return JSON.parse(JSON.stringify(envConfig)) as UniDeployUserConfig;
};

export const loadConfig = async (inlineConfig: UniDeployUserConfig = {}, cwd = process.cwd()) => {
  const envConfig = loadEnvConfig();
  const { config: loadedConfig = {} } = await _loadConfig<UniDeployUserConfig>({
    cwd,
    sources: [{ files: 'uni-deploy.config' }, sourcePackageJsonFields({ fields: 'uni-deploy' })],
    merge: true,
  });
  const resolved: UniDeployConfig = {
    ...defaultConfig,
    ...envConfig,
    ...loadedConfig,
    ...inlineConfig,
    'mp-weixin': {
      appid: getFileField(
        [
          { entry: ['dist', 'mp-weixin', 'project.config.json'], prop: 'appid' },
          { entry: ['dist', 'build', 'mp-weixin', 'project.config.json'], prop: 'appid' },
          { entry: ['dist', '**', 'mp-weixin', 'project.config.json'], prop: 'appid' },
          { entry: ['src', 'project.config.json'], prop: 'appid' },
          { entry: ['**', 'project.config.json'], prop: 'appid' },
          { entry: ['src', 'manifest.json'], prop: ['mp-weixin', 'appid'] },
          { entry: ['**', 'manifest.json'], prop: ['mp-weixin', 'appid'] },
        ],
        cwd,
      ) as string | undefined,
      projectPath: getFileDir(
        [
          { entry: ['dist', 'mp-weixin', 'project.config.json'] },
          { entry: ['dist', 'build', 'mp-weixin', 'project.config.json'] },
          { entry: ['dist', '**', 'mp-weixin', 'project.config.json'] },
          { entry: ['mp-weixin', 'project.config.json'] },
          { entry: ['**', 'project.config.json'] },
        ],
        cwd,
      ),
      type: 'miniProgram',
      version: getVersionField(cwd),
      setting: getFileField([
        { entry: ['dist', 'mp-weixin', 'project.config.json'], prop: ['setting'] },
        { entry: ['dist', 'build', 'mp-weixin', 'project.config.json'], prop: ['setting'] },
        { entry: ['dist', '**', 'mp-weixin', 'project.config.json'], prop: ['setting'] },
      ]) as Wechat.ICompileSettings | undefined,
      desc: 'Handled by uni-deploy',
      qrcodeFormat: 'image',
      qrcodeOutputDest: 'qrcode.png',
      ...envConfig['mp-weixin'],
      ...loadedConfig['mp-weixin'],
      ...inlineConfig['mp-weixin'],
    },
    'mp-alipay': {
      appid: getFileField(
        [
          { entry: ['dist', 'mp-alipay', 'mini.project.json'], prop: 'appid' },
          { entry: ['dist', 'build', 'mp-alipay', 'mini.project.json'], prop: 'appid' },
          { entry: ['dist', '**', 'mp-alipay', 'mini.project.json'], prop: 'appid' },
          { entry: ['src', 'mini.project.json'], prop: 'appid' },
          { entry: ['**', 'mini.project.json'], prop: 'appid' },
          { entry: ['src', 'manifest.json'], prop: ['mp-alipay', 'appid'] },
          { entry: ['**', 'manifest.json'], prop: ['mp-alipay', 'appid'] },
        ],
        cwd,
      ) as string,
      projectPath: getFileDir(
        [
          { entry: ['dist', 'mp-alipay', 'mini.project.json'] },
          { entry: ['dist', 'build', 'mp-alipay', 'mini.project.json'] },
          { entry: ['dist', '**', 'mp-alipay', 'mini.project.json'] },
          { entry: ['mp-alipay', 'mini.project.json'] },
          { entry: ['**', 'mini.project.json'] },
        ],
        cwd,
      ),
      version: getVersionField(cwd),
      appxv: 'v2',
      ...envConfig['mp-alipay'],
      ...loadedConfig['mp-alipay'],
      ...inlineConfig['mp-alipay'],
    },
    dingtalk: {
      ...envConfig.dingtalk,
      ...loadedConfig.dingtalk,
      ...inlineConfig.dingtalk,
    },
    wecom: {
      ...envConfig.wecom,
      ...loadedConfig.wecom,
      ...inlineConfig.wecom,
    },
  };

  return JSON.parse(JSON.stringify(resolved));
};
