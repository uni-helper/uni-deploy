#!/usr/bin/env node
import { Command } from 'commander';
import updateNotifier from 'update-notifier';
import pkg from '../package.json';
import { loadConfig } from './config';
import { imsValidate, imNotifyPreview, imNotifyUpload } from './im';
import { platformsValidate, platformPreview, platformUpload } from './platform';
import { logger } from './utils';
import type { Im, Platform } from './types';

updateNotifier({ pkg }).notify();

const program = new Command(pkg.name).version(pkg.version).description(pkg.description);

program
  .command('validate')
  .description('检查配置文件')
  .action(async () => {
    const config = await loadConfig();
    platformsValidate(config);
    imsValidate(config);
  });

program
  .command('upload')
  .description('上传')
  .action(async () => {
    const config = await loadConfig();
    // 检查
    const validatePlatformsResults = platformsValidate(config);
    const validateImsResults = imsValidate(config);
    // 只处理配置正确的平台
    const platforms = Object.keys(config.platform ?? {}).filter(
      (_, index) => validatePlatformsResults[index],
    ) as Platform[];
    // 批量上传
    const uploadResults = await Promise.all(
      platforms.map((platform) => platformUpload(config, platform)),
    );
    // 只处理配置正确的 im
    const ims = Object.keys(config.im ?? {}).filter(
      (_, index) => validateImsResults[index],
    ) as Im[];
    // 批量通知
    await Promise.all(
      ims.map((im) =>
        uploadResults.map((result, index) => imNotifyUpload(config, im, platforms[index], result)),
      ),
    );
    // 结束
    logger.info('上传操作结束。');
  });

program
  .command('preview')
  .description('预览')
  .action(async () => {
    const config = await loadConfig();
    // 检查
    const validatePlatformsResults = platformsValidate(config);
    const validateImsResults = imsValidate(config);
    // 只处理配置正确的平台
    const platforms = Object.keys(config.platform ?? {}).filter(
      (_, index) => validatePlatformsResults[index],
    ) as Platform[];
    // 批量预览
    const previewResults = await Promise.all(
      platforms.map((platform) => platformPreview(config, platform)),
    );
    // 只处理配置正确的 im
    const ims = Object.keys(config.im ?? {}).filter(
      (_, index) => validateImsResults[index],
    ) as Im[];
    // 批量通知
    await Promise.all(
      ims.map((im) =>
        previewResults.map((result, index) =>
          imNotifyPreview(config, im, platforms[index], result),
        ),
      ),
    );
    // 结束
    logger.info('预览操作结束。');
  });

await program.parseAsync();
