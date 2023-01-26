<div align="center">
  <h1>resource-hint-webpack-plugin</h1>

  <a href="https://github.com/robot12580">
    <img
      width="80"
      alt="robot12580"
      src="https://github.com/robot12580/materials/blob/main/images/dog2.png?raw=true"
    />
  </a>

  <p>快速配置 Resource Hints 的 Webpack 插件</p>
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

`resource-hint-webpack-plugin` 集成了 [Resource Hints][resource-hints] 的能力，能够在打包时自动添加 `link` 标签到 `html` 中。

基于 [@vuejs/preload-webpack-plugin][v-pwp]，强化了配置功能 `options`，并且新增支持 `dns-prefetch / prerender / preconnect` 的能力。

```html
<link href="src_async_js.f23b5bce.js" rel="preload" as="script">
<link href="https://example.com/fonts/font.woff" rel="preload" as="font" crossorigin>
<link href="src_async_js.f23b5bce.js" rel="prefetch">
<link href="//fonts.googleapis.com" rel="dns-prefetch">
<link href="https://www.keycdn.com" rel="prerender" >
<link href="https://cdn.domain.com" rel="preconnect" crossorigin>
```

## 内容列表

- [预检查](#预检查)
- [安装](#安装)
- [配置项](#配置项)
- [Hints](#hints)
  - [preload](#preload)
  - [prefetch](#prefetch)
  - [dns-prefetch](#dns-prefetch) (新)
  - [prerender](#prerender) (新)
  - [preconnect](#preconnect) (新)
- [进阶用法](#进阶用法)
  - [指定 chunk 和 entry](#指定-chunk-和-entry)
  - [指定 htmls](#指定-htmls)
  - [批量添加](#批量添加)

## 预检查

确保 webpack 的版本在 5 以上，并且正在使用 [html-webpack-plugin][hwp]。

```ts
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ResourceHintWebpackPlugin } = require('resource-hint-webpack-plugin');

module.exports = {
  /* ... */
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: ['index'],
      inject: 'body'
    }),
    new ResourceHintWebpackPlugin([{
      rel: 'preload',
      include: {
        type: 'asyncChunks',
      }
    }])
  ]
  /* ... */
}
```

## 安装

通过 [npm][npm] 安装，并将其添加到开发时依赖中 `devDependencies`:
```
npm install resource-hint-webpack-plugin --save-dev
```
或者

通过 [yarn][yarn] 安装:
```
yarn add resource-hint-webpack-plugin --dev
```

## 配置项

配置项改造成了一个数组，支持传入多个 `options`，下面是单个的配置项:

|字段名|类型|默认值|描述|
|:---:|:-:|:---:|:--|
|**`rel`**|`{String}`|`-`|脚本的预加载模式|
|**`include`**|`{{IncludeOption}}`|`-`|指定需要预加载的脚本|

## Hints

### preload

`preload` 允许预加载在 CSS 和 JavaScript 中定义的资源，并允许决定何时应用每个资源，需要配合 [webpack 懒加载][webpack-lazy]。

```ts
new ResourceHintWebpackPlugin([{
  rel: 'preload',
  include: {
    type: 'asyncChunks',
  }
}])
```

### prefetch

`prefetch` 是一个低优先级的资源提示，允许浏览器在后台（空闲时）获取将来可能用得到的资源，并且将他们存储在浏览器的缓存中。

```ts
new ResourceHintWebpackPlugin([{
  rel: 'prefetch',
  include: {
    type: 'asyncChunks'
  }
}])
```

## dns-prefetch

`dns-prefetch` 允许浏览器在用户浏览页面时在后台运行 `DNS` 的解析。

```ts
new ResourceHintWebpackPlugin([{
  rel: 'dns-prefetch',
  include: {
    hosts: ['//fonts.googleapis.com']
  }
}])
```

## prerender

`prerender` 优化了可能导航到的下一页上的资源的加载，在后台渲染了整个页面和整个页面所有的资源。

> 要小心的使用 prerender，因为它将会加载很多资源并且可能造成带宽的浪费，尤其是在移动设备上，并且可能会造成一些[副作用][side-effect]。

```ts
new ResourceHintWebpackPlugin([{
  rel: 'prerender',
  include: {
    hosts: ['https://www.keycdn.com']
  }
}])
```

## preconnect

`preconnect` 允许浏览器在一个 HTTP 请求正式发给服务器前预先执行一些操作，这包括 `DNS` 解析，`TLS` 协商，`TCP` 握手，这消除了往返延迟并为用户节省了时间。

```ts
new ResourceHintWebpackPlugin([{
  rel: 'preconnect',
  include: {
    hosts: ['https://cdn.domain.com']
  }
}])
```

## 进阶用法

### 指定 chunk 和 entry

在使用 `prefetch` 和 `preload` 时，可以指定 `chunks` 或者 `entries` 的值来确定需要生成 `link` 的页面。

```ts
module.exports = {
  output: {
    filename: '[name].[contenthash:8].js',
    path: path.resolve(__dirname, 'dist')
  }
  plugins: [
    //...
    new ResourceHintWebpackPlugin([{
      rel: 'preload', // 或者 prefetch
      include: {
        chunks: ['index']
      }
    }])
  ]
}
```

```ts
module.exports = {
  entry: {
    index: './src/index.js',
    index2: './src/index2.js'
  },
  plugins: [
    //...
    new ResourceHintWebpackPlugin([{
      rel: 'preload', // 或者 prefetch
      include: {
        entries: ['index2']
      }
    }])
  ]
}
```

### 指定 htmls

所有的 `hints` 支持指定 `htmls`。

```ts
new ResourceHintWebpackPlugin([{
  rel: 'dns-prefetch', // prerender, preconnect, preload, prefetch
  include: {
    htmls: ['index.html']
  }
}])
```

### 批量添加

本插件增强了 `options` 的能力，能够同时插入不同的 `hints`。

```ts
new ResourceHintWebpackPlugin(
  [
    {
      rel: 'preload',
      include: {
        type: 'asyncChunks'
      }
    },
    {
      rel: 'dns-prefetch',
      include: {
        hosts: ['//fonts.googleapis.com']
      }
    },
    {
      rel: 'prerender',
      include: {
        hosts: ['https://www.keycdn.com']
      }
    },
    {
      rel: 'preconnect',
      include: {
        hosts: ['https://cdn.domain.com']
      }
    }
  ]
)
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

[resource-hints]:https://www.keycdn.com/blog/resource-hints
[v-pwp]:https://github.com/vuejs/preload-webpack-plugin
[hwp]:https://github.com/ampedandwired/html-webpack-plugin
[webpack-lazy]:https://www.webpackjs.com/guides/lazy-loading/
[side-effect]:https://en.wikipedia.org/wiki/Link_prefetching#Issues_and_criticisms