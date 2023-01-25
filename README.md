<div align="center">
  <h1>resource-hint-webpack-plugin</h1>

  <a href="https://github.com/robot12580">
    <img
      width="80"
      alt="robot12580"
      src="https://github.com/robot12580/materials/blob/main/images/dog2.png?raw=true"
    />
  </a>

  <p>webpack 脚本加载插件</p>
</div>
<hr />

[![Build Status][build-badge]][build]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]
[![PRs Welcome][prs-badge]][prs]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]

## 简介
基于 [@vuejs/preload-webpack-plugin](https://github.com/vuejs/preload-webpack-plugin) 实现的插件, 实现了资源的预加载。

主要区别在于: 
- 专注于脚本（script）。
- 引入了 webpack 5 的一些特性。

```html
<link href="src_async_js.f23b5bce.js" rel="preload" as="script"></link>
<link href="src_async_js.f23b5bce.js" rel="prefetch"></link>
```

## 预检查
确保 webpack 的版本在 5 以上, 并且正在使用 [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin)。

## 安装

通过 [npm][npm] 安装, 并将其添加到开发时依赖中 `devDependencies`:
```
npm install resource-hint-webpack-plugin --save-dev
```
或者

通过 [yarn][yarn] 安装:
```
yarn add resource-hint-webpack-plugin --dev
```
## 选项
下面是 `resource-hint-webpack-plugin` 的配置项:

|字段名|类型|默认值|描述|
|:---:|:-:|:---:|:--|
|**`rel`**|`{String}`|`preload`|脚本的预加载模式|
|**`include`**|`{String\|Object}`|`asyncChunks`|指定需要预加载的脚本|

## 案例
下面是 webpack 的配置的案例。

### 使用 preload 预加载异步文件

```ts
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ResourceHintWebpackPlugin } = require('resource-hint-webpack-plugin');

module.exports = {
  //...
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: ['index'],
      inject: 'body'
    }),
    new ResourceHintWebpackPlugin({
      rel: 'preload',
      include:  'asyncChunks'
    })
  ]
  //...
}
```

### 使用 prefetch 加载异步文件

```ts
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ResourceHintWebpackPlugin } = require('resource-hint-webpack-plugin');

module.exports = {
  //...
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: ['index'],
      inject: 'body'
    }),
    new ResourceHintWebpackPlugin({
      rel: 'preload',
      include:  'asyncChunks'
    })
  ]
  //...
}
```

### 指定 chunk

```ts
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ResourceHintWebpackPlugin } = require('resource-hint-webpack-plugin');

module.exports = {
  //...
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: ['index'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      template: './public/index2.html',
      filename: 'index2.html',
      chunks: ['index2'],
      inject: 'body'
    }),
    new ResourceHintWebpackPlugin({
      rel: 'preload',
      include: {
        chunks: ['index']
      }
    })
  ]
  //...
}
```

### 指定 entry

```ts
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ResourceHintWebpackPlugin } = require('resource-hint-webpack-plugin');

module.exports = {
  //...
  entry: {
    index: './src/index.js',
    index2: './src/index2.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: ['index'],
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      template: './public/index2.html',
      filename: 'index2.html',
      chunks: ['index2'],
      inject: 'body'
    }),
    new ResourceHintWebpackPlugin({
      rel: 'preload',
      include: {
        entries: ['index2']
      }
    })
  ]
  //...
}
```


[npm]: https://www.npmjs.com/
[yarn]: https://classic.yarnpkg.com
[node]: https://nodejs.org
[build-badge]:https://img.shields.io/github/workflow/status/resource-hint-webpack-plugin/validate?logo=github&style=flat-square
[build]: https://github.com/robot12580/resource-hint-webpack-plugin/actions/workflows/ci.yml/badge.svg
[version-badge]: https://img.shields.io/npm/v/resource-hint-webpack-plugin.svg?style=flat-square
[package]: https://www.npmjs.com/package/resource-hint-webpack-plugin
[downloads-badge]: https://img.shields.io/npm/dm/resource-hint-webpack-plugin.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/resource-hint-webpack-plugin
[license-badge]: https://img.shields.io/npm/l/resource-hint-webpack-plugin.svg?style=flat-square
[license]: https://github.com/robot12580/resource-hint-webpack-plugin/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[github-watch-badge]: https://img.shields.io/github/watchers/robot12580/resource-hint-webpack-plugin.svg?style=social
[github-watch]: https://github.com/robot12580/resource-hint-webpack-plugin/watchers
[github-star-badge]: https://img.shields.io/github/stars/robot12580/resource-hint-webpack-plugin.svg?style=social
[github-star]: https://github.com/robot12580/resource-hint-webpack-plugin/stargazers