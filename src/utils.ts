import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { globbySync } from 'globby';
import stripJsonComments from 'strip-json-comments';
import { get } from 'lodash-unified';
import pino from 'pino';
import pinoPretty from 'pino-pretty';

const pinoPrettyStream = pinoPretty({
  colorize: true,
  ignore: 'pid,hostname',
  translateTime: 'SYS:standard',
});

export const logger = pino(pinoPrettyStream);

const globbyIgnore = ['**/node_modules', '**/dist', '**/.hbuilder', '**/.hbuilderx'];

export const getFileField = (
  filters: { entry: string | string[]; prop: string | string[] }[],
  cwd = process.cwd(),
): string | number | boolean | Array<any> | Record<string, any> | undefined => {
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
      return undefined;
    }
  }
  return undefined;
};

export const getFilePath = (filters: { entry: string | string[] }[], cwd = process.cwd()) => {
  const entries = globbySync(
    filters.map((f) => (Array.isArray(f.entry) ? resolve(cwd, ...f.entry) : resolve(cwd, f.entry))),
    { ignore: globbyIgnore },
  );
  return entries[0] ?? undefined;
};

export const getFileDir = (filters: { entry: string | string[] }[], cwd = process.cwd()) => {
  const entries = globbySync(
    filters.map((f) => (Array.isArray(f.entry) ? resolve(cwd, ...f.entry) : resolve(cwd, f.entry))),
    { ignore: globbyIgnore },
  );
  return entries[0] ? resolve(entries[0], '..') : undefined;
};

export const getVersionField = (cwd = process.cwd()) =>
  getFileField(
    [
      { entry: 'package.json', prop: 'version' },
      { entry: ['src', 'manifest.json'], prop: ['versionName'] },
      { entry: ['**', 'manifest.json'], prop: ['versionName'] },
    ],
    cwd,
  ) as string | undefined;
