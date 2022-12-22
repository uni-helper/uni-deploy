import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import { getFileDir, getFileField, getFilePath } from './utils';
import { defaultConfig } from './config';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('utils', () => {
  it('getFileField', () => {
    expect(
      getFileField(defaultConfig, [
        { entry: [__dirname, 'fixtures', 'manifest.json'], prop: ['mp-weixin', 'appid'] },
        { entry: [__dirname, '**', 'fixtures', 'manifest.json'], prop: ['mp-weixin', 'appid'] },
      ]),
    ).toBe('touristappid');
    expect(
      getFileField(defaultConfig, [{ entry: ['not-exist.file'], prop: ['not', 'exist', 'prop'] }]),
    ).toBe('');
  });

  it('getFilePath', () => {
    expect(
      getFilePath(defaultConfig, [
        { entry: [__dirname, 'fixtures', 'manifest.json'] },
        { entry: [__dirname, '**', 'fixtures', 'manifest.json'] },
      ]),
    ).toBe(resolve(__dirname, 'fixtures', 'manifest.json'));
    expect(getFilePath(defaultConfig, [{ entry: ['not-exist.file'] }])).toBe('');
  });

  it('getFileDir', () => {
    expect(
      getFileDir(defaultConfig, [
        { entry: [__dirname, 'fixtures', 'manifest.json'] },
        { entry: [__dirname, '**', 'fixtures', 'manifest.json'] },
      ]),
    ).toBe(resolve(__dirname, 'fixtures'));
    expect(getFileDir(defaultConfig, [{ entry: ['not-exist.file'] }])).toBe('');
  });
});
