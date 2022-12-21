#!/usr/bin/env node
import { Command } from 'commander';
import pkg from '../package.json';
import { defaultConfig, loadConfig, mergeConfig, UniDeployConfig } from './config';
import { Im, imNotifyPreviewResult, imNotifyUploadResult } from './im';
import { Platform, platformPreview, platformUpload } from './platform';
import { logger, validatePlatforms, validateIms } from './utils';

const program = new Command(pkg.name).version(pkg.version).description(pkg.description);

async function getConfig(): Promise<UniDeployConfig> {
  try {
    const { data } = await loadConfig();
    return data ? mergeConfig(data) : defaultConfig;
  } catch {
    return defaultConfig;
  }
}

program
  .command('validate')
  .description('检查配置文件')
  .action(async () => {
    const config = await getConfig();
    validatePlatforms(config);
    validateIms(config);
  });

program
  .command('upload')
  .description('上传')
  .action(async () => {
    const config = await getConfig();
    // 检查
    const validatePlatformsResults = validatePlatforms(config);
    const validateImsResults = validateIms(config);
    // 只处理配置正确的平台
    const platforms = Object.keys(config.platform ?? {}).filter(
      (_, index) => validatePlatformsResults[index],
    ) as Platform[];
    // 批量上传
    const uploadResults = await Promise.all(
      platforms.map((platform) => platformUpload(config, { platform })),
    );
    // 只处理配置正确的 im
    const ims = Object.keys(config.im ?? {}).filter(
      (_, index) => validateImsResults[index],
    ) as Im[];
    // 批量通知
    await Promise.all(
      ims.map((im) => uploadResults.map((result) => imNotifyUploadResult(config, { im, result }))),
    );
    // 结束
    logger.info('上传操作结束。');
  });

program
  .command('preview')
  .description('预览')
  .action(async () => {
    const config = await getConfig();
    // 检查
    const validatePlatformsResults = validatePlatforms(config);
    const validateImsResults = validateIms(config);
    // 只处理配置正确的平台
    const platforms = Object.keys(config.platform ?? {}).filter(
      (_, index) => validatePlatformsResults[index],
    ) as Platform[];
    // 批量预览
    const previewResults = await Promise.all(
      platforms.map((platform) => platformPreview(config, { platform })),
    );
    // 只处理配置正确的 im
    const ims = Object.keys(config.im ?? {}).filter(
      (_, index) => validateImsResults[index],
    ) as Im[];
    // 批量通知
    await Promise.all(
      ims.map((im) =>
        previewResults.map((result) => imNotifyPreviewResult(config, { im, result })),
      ),
    );
    // 结束
    logger.info('预览操作结束。');
  });

await program.parseAsync();
