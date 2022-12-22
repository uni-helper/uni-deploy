import { resolve, relative } from 'node:path';
import { readFileSync } from 'node:fs';
import { globbySync } from 'globby';
import stripJsonComments from 'strip-json-comments';
import { get } from 'lodash-unified';
import pino from 'pino';
import pinoPretty from 'pino-pretty';
import { platforms, platformValidate } from './platform';
import { ims, imValidate } from './im';
import type { UniDeployConfig } from './types';

export const pinoPrettyStream = pinoPretty({
  colorize: true,
  levelFirst: true,
  ignore: 'pid,hostname',
  translateTime: 'SYS:standard',
});

export const logger = pino(pinoPrettyStream);

export const globbyIgnore = ['**/node_modules', '**/dist', '**/.hbuilder', '**/.hbuilderx'];

export const jsoncParse = (data: string) => {
  try {
    return new Function('return ' + stripJsonComments(data).trim())();
  } catch {
    return {};
  }
};

export const loadJson = async (filePath: string) => {
  try {
    return jsoncParse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse ${relative(process.cwd(), filePath)}: ${error.message}`);
    } else {
      throw error;
    }
  }
};

export const getFileField = (
  config: UniDeployConfig,
  filters: { entry: string | string[]; prop: string | string[] }[],
): string | number | boolean | Array<any> | Record<string, any> => {
  const { cwd } = config;
  const entries = globbySync(
    filters.map((f) => (Array.isArray(f.entry) ? resolve(cwd, ...f.entry) : resolve(cwd, f.entry))),
    { ignore: globbyIgnore },
  );
  for (const [index, entry] of entries.entries()) {
    try {
      const content = JSON.parse(stripJsonComments(readFileSync(entry, 'utf-8')));
      const field = get(content, filters[index].prop);
      if (field != null) return field;
    } catch (error) {
      return '';
    }
  }
  return '';
};

export const getFilePath = (config: UniDeployConfig, filters: { entry: string | string[] }[]) => {
  const { cwd } = config;
  const entries = globbySync(
    filters.map((f) => (Array.isArray(f.entry) ? resolve(cwd, ...f.entry) : resolve(cwd, f.entry))),
    { ignore: globbyIgnore },
  );
  return entries[0] ?? '';
};

export const getFileDir = (config: UniDeployConfig, filters: { entry: string | string[] }[]) => {
  const { cwd } = config;
  const entries = globbySync(
    filters.map((f) => (Array.isArray(f.entry) ? resolve(cwd, ...f.entry) : resolve(cwd, f.entry))),
    { ignore: globbyIgnore },
  );
  return entries[0] ? resolve(entries[0], '..') : '';
};

export const validatePlatforms = (config: UniDeployConfig) =>
  platforms.map((platform) => platformValidate(config, platform));

export const validateIms = (config: UniDeployConfig) => ims.map((im) => imValidate(config, im));
