# @uni-helper/uni-deploy

[![License](https://img.shields.io/github/license/uni-helper/uni-deploy)](https://github.com/uni-helper/uni-deploy/blob/main/LICENSE)

[![npm](https://img.shields.io/npm/v/@uni-helper/uni-deploy)](https://www.npmjs.com/package/@uni-helper/uni-deploy)

**WIP**

支持在脚本文件和 CI/CD 中调用以自动部署 `uni-app` 应用。

## 起步

### 安装依赖

安装依赖。

使用 `npm`：

```shell
npm install @uni-helper/uni-deploy -D
```

使用 `yarn`：

```shell
yarn install @uni-helper/uni-deploy -D
```

使用 `pnpm`：

```shell
pnpm install @uni-helper/uni-deploy -D
```

使用 `cnpm`：

```shell
cnpm install @uni-helper/uni-deploy -D
```

### 配置文件

支持以下配置：

- `uni-deploy.config.ts`
- `uni-deploy.config.cts`
- `uni-deploy.config.mts`
- `uni-deploy.config.js`
- `uni-deploy.config.cjs`
- `uni-deploy.config.mjs`
- `uni-deploy.config.json`
- `package.json` 中的 `uni-deploy` 字段内容

借助 [joycon](https://github.com/egoist/joycon)、[bundle-require](https://github.com/egoist/bundle-require)、[strip-json-comments](https://github.com/sindresorhus/strip-json-comments) 的帮助，只要读取到以上任何配置文件，就会将其内容作为你提供的 `uni-deploy` 的配置。

以下是一个 `uni-deploy.config.ts` 的示例。

```typescript
import { defineConfig } from 'uni-deploy';

export default defineConfig({
  /* 通用配置 */
  // 当前进程的工作目录，默认为执行目录
  cwd: process.cwd(),

  /* 应用平台 */
  platform: {
    // 微信小程序配置
    'mp-weixin': { ... },
  },

  /* 沟通工具 */
  im: {
    // 企业微信配置
    'wecom': { ... },
  },
})
```

## 配置

### 应用平台

如果不需要某个应用平台，传入 `falsy` 值即可。

#### 微信小程序

类型定义如下。

```typescript
import { ICreateProjectOptions } from 'miniprogram-ci/dist/@types/ci/project';
import { IInnerUploadOptions } from 'miniprogram-ci/dist/@types/ci/upload';

export interface MpWeixinConfig {
  /** miniprogram-ci ci.project */
  // {
  //   /**
  //    * 小程序 / 小游戏 appid
  //    * 如果没有填写，会尝试按以下顺序读取，如果读取失败将无法运行
  //    * ./src/manifest.json mp-weixin appid
  //    * ./**/manifest.json mp-weixin appid
  //    * ./dist/mp-weixin/project.config.json appid
  //    * ./dist/build/mp-weixin/project.config.json appid
  //    * ./dist/**\/mp-weixin/project.config.json appid
  //    */
  //   appid?: string;
  //   /**
  //    * 项目路径
  //    * 如果没有填写，会尝试按以下顺序寻找 project.config.json 并将其所在目录作为项目路径，如果寻找失败将无法运行
  //    * ./dist/mp-weixin/project.config.json
  //    * ./dist/build/mp-weixin/project.config.json
  //    * ./dist/**\/mp-weixin/project.config.json
  //    */
  //   path?: string;
  //   /**
  //    * 私钥内容
  //    */
  //   privateKey?: string;
  //   /**
  //    * 私钥路径
  //    * 如果没有填写，会尝试按以下顺序寻找 .key 文件并将其路径作为私钥路径，寻找失败不影响继续运行
  //    * ./**\/private.${appid}.key
  //    * ./**\/weixin.${appid}.key
  //    * ./**\/wechat.${appid}.key
  //    */
  //   privateKeyPath?: string;
  //   /**
  //    * 当前项目类型，默认为 miniprogram
  //    */
  //   type?: MiniProgramCI.ProjectType;
  // };
  project?: Partial<ICreateProjectOptions>;

  /** miniprogram-ci ci.upload */
  // {
  //   /**
  //    * 版本号
  //    * 如果没有填写，会尝试按以下顺序读取，如果读取失败将无法运行
  //    * ./package.json version
  //    * ./src/manifest.json versionName
  //    * ./**/manifest.json versionName
  //    */
  //   version?: string;
  //   /**
  //    * 编译设置
  //    * 如果没有填写，会尝试按以下顺序读取，如果读取失败将无法运行
  //    * ./src/manifest.json mp-weixin setting
  //    * ./**/manifest.json mp-weixin setting
  //    * ./dist/mp-weixin/project.config.json setting
  //    * ./dist/build/mp-weixin/project.config.json setting
  //    * ./dist/**\/mp-weixin/project.config.json setting
  //    */
  //   setting?: MiniProgramCI.ICompileSettings;
  //   /**
  //    * 备注，默认为 Uploaded by uni-deploy
  //    */
  //   desc?: string;
  // };
  upload?: Partial<Omit<IInnerUploadOptions, 'project'>>;

  /** miniprogram-ci ci.preview */
  // {
  //   /**
  //    * 版本号
  //    * 如果没有填写，会尝试按以下顺序读取，如果读取失败将无法运行
  //    * ./package.json version
  //    * ./src/manifest.json versionName
  //    * ./**/manifest.json versionName
  //    */
  //   version?: string;
  //   /**
  //    * 编译设置
  //    * 如果没有填写，会尝试按以下顺序读取，如果读取失败将无法运行
  //    * ./src/manifest.json mp-weixin setting
  //    * ./**/manifest.json mp-weixin setting
  //    * ./dist/mp-weixin/project.config.json setting
  //    * ./dist/build/mp-weixin/project.config.json setting
  //    * ./dist/**\/mp-weixin/project.config.json setting
  //    */
  //   setting?: MiniProgramCI.ICompileSettings;
  //   /**
  //    * 备注，默认为 Uploaded by uni-deploy
  //    */
  //   desc?: string;
  //   /**
  //    * 二维码格式，默认为 image
  //    */
  //   qrcodeFormat?: 'base64' | 'image' | 'terminal';
  //   /**
  //    * 二维码输出路径，默认为 qrcode.png
  //    */
  //   qrcodeOutputDest?: string;
  // };
  preview?: Partial<Omit<IInnerUploadOptions, 'project' | 'test'> & { test?: true }>;
}
```

### 沟通工具

如果不需要某个沟通工具，传入 `falsy` 值即可。

#### 钉钉

```typescript
export interface DingtalkConfig {
  /**
   * 钉钉机器人 webhook
   * 如果不填写，无法发送请求
   */
  webhook?: string | string[];
}
```

#### 企业微信

```typescript
export interface WecomConfig {
  /**
   * 企业微信机器人 webhook
   * 如果不填写，无法发送请求
   */
  webhook?: string | string[];
}
```

### CLI 调用

提供基于 ESM 的 CLI 调用。参考了 <https://www.stefanjudis.com/snippets/how-to-create-a-module-based-node-js-executable/> 和 <https://2ality.com/2022/07/nodejs-esm-shell-scripts.html>。

注册的命令是 `uni-deploy` 和 `ud`。你可以通过 `uni-deploy -h` 或 `ud -h` 查看命令提示。

目前提供三个命令。

#### `uni-deploy validate`

检查配置文件。

#### `uni-deploy upload`

上传。

#### `uni-deploy preview`

预览。

### 脚本调用

你可以从 `@uni-helper/uni-deploy` 导入各种方法来组合使用。CLI 只是提供了更便捷的方式操作。

```typescript
import {...} from '@uni-helper/uni-deploy';
```

## 致谢

- [taro-deploy](https://github.com/linjackson78/taro-deploy)
- [@tarojs/plugin-mini-ci](https://docs.taro.zone/docs/plugin-mini-ci)
