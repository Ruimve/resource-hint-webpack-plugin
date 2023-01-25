import { ResourceHintOption, HtmlPluginData, RelType } from './define';
import { Compiler, Compilation } from "webpack";

import HtmlWebpackPlugin, { HtmlTagObject } from "html-webpack-plugin";

import { defaultOptions } from './lib/defaultOptions';
import { extractChunks } from './lib/extractChunks';
import { doesChunkBelongToHtml } from './lib/doesChunkBelongToHtml';
import { doesScript } from './lib/doesScript';

export class ResourceHintWebpackPlugin {
  options: ResourceHintOption;
  resourceHints: HtmlTagObject[];
  constructor(options: ResourceHintOption) {
    /** 聚合默认选项和用户选项 */
    this.options = Object.assign(defaultOptions, options);
    this.resourceHints = [];
  }

  generateLinks(compilation: Compilation, htmlPluginData: HtmlPluginData): void {
    /** 获取用户选项 */
    const options = this.options;
    const chunks = Array.from(compilation.chunks);

    /** 根据用户选项筛选需要的 chunk */
    const extractedChunks = extractChunks(chunks, options);

    /** 匹配当前 html 的 chunk */
    const htmlChunks = extractedChunks.filter(
      chunk => doesChunkBelongToHtml(chunk, htmlPluginData.plugin.options)
    );

    /** 获取所有 chunk 中的所有文件 */
    const allFiles = htmlChunks.reduce<string[]>((accumulated, chunk) => accumulated.concat(Array.from(chunk.files)), []);

    /** 除去重复的文件 */
    const uniqueFiles = Array.from(new Set(allFiles));

    /** 过滤出脚本文件 */
    const scriptFiles = uniqueFiles.filter(file => doesScript(file));

    /** 为每个 script 文件添加 link 标签 */
    const webpackPublicPath = compilation.outputOptions.publicPath;
    const publicPath = webpackPublicPath && webpackPublicPath !== 'auto' ? webpackPublicPath : '';

    const links: HtmlTagObject[] = scriptFiles.map(file => {
      const href = `${publicPath}${file}`;
      const attributes = {
        href,
        rel: options.rel,
        as: options.rel === RelType.preload ? 'script' : undefined
      };
      return {
        tagName: 'link',
        voidTag: false,
        meta: {},
        attributes
      }
    });

    this.resourceHints = links;
  }

  apply(compiler: Compiler): void {
    compiler.hooks.compilation.tap(
      'ResourceHintWebpackPlugin',
      (compilation: Compilation) => {
        HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
          'ResourceHintWebpackPlugin',
          (htmlPluginData, callback) => {
            this.generateLinks(compilation, htmlPluginData);
            callback();
          }
        );

        HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
          'ResourceHintWebpackPlugin',
          (htmlPluginData, callback) => {
            htmlPluginData.assetTags.styles = [
              ...this.resourceHints,
              ...htmlPluginData.assetTags.styles
            ];
            callback();
          }
        );
      }
    )
  }
}