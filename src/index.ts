import { ResourceHintOption, HtmlPluginData, RelType, IncludeType } from './define';
import { Compiler, Compilation } from "webpack";

import HtmlWebpackPlugin, { HtmlTagObject } from "html-webpack-plugin";

import { extractChunks } from './lib/extractChunks';
import { doesChunkBelongToHtml } from './lib/doesChunkBelongToHtml';
import { generateAttributes } from './lib/generateAttributes';
import { doesHtmlBeIncluded } from './lib/doesHtmlBeIncluded';

export class ResourceHintWebpackPlugin {
  options: ResourceHintOption[];
  resourceHints: HtmlTagObject[];
  constructor(options: ResourceHintOption[]) {
    /** 聚合默认选项和用户选项 */
    this.options = options || [];
    this.resourceHints = [];
  }

  generateCommonLinks(options: ResourceHintOption, compilation: Compilation, htmlPluginData: HtmlPluginData): HtmlTagObject[] {
    /** 获取选项中的 include 参数 */
    const { include = { type: IncludeType.asyncChunks } } = options;
    /** 根据用户选项筛选需要的 chunk */
    const extractedChunks = extractChunks(compilation, include);
    /** 匹配当前 html 的 chunk */
    const htmlChunks = include.type === IncludeType.allAssets ? extractedChunks : extractedChunks.filter(
      chunk => doesChunkBelongToHtml(chunk, htmlPluginData.plugin.options)
    );
    /** 获取所有 chunk 中的所有文件 */
    const allFiles = htmlChunks.reduce<string[]>((accumulated, chunk) => accumulated.concat(Array.from(chunk.files)), []);
    /** 除去重复的文件 */
    const uniqueFiles = Array.from(new Set(allFiles));
    /** 对文件进行排序 */
    const sortedFiles = uniqueFiles.sort();
    /** 获取配置的 CDN 路径 */
    const webpackPublicPath = compilation.outputOptions.publicPath;
    const publicPath = webpackPublicPath && webpackPublicPath !== 'auto' ? webpackPublicPath : '';
    /** prefetch and preload */
    const commonLinks: HtmlTagObject[] = sortedFiles.map(file => {
      const href = `${publicPath}${file}`;
      const attributes = generateAttributes(href, options.rel);
      return {
        tagName: 'link',
        voidTag: false,
        meta: {},
        attributes
      }
    });
    return commonLinks;
  }

  generateDNSLinks(options: ResourceHintOption, compilation: Compilation, htmlPluginData: HtmlPluginData): HtmlTagObject[] {
    const include = options.include;
    /** dns-prefetch */
    const dnsLinks = (include?.hosts || []).map(d => {
      const attributes = {
        rel: RelType.dnsPrefetch,
        href: d
      }
      return {
        tagName: 'link',
        voidTag: false,
        meta: {},
        attributes
      }
    });
    return dnsLinks;
  }

  generateRenderLinks(options: ResourceHintOption, compilation: Compilation, htmlPluginData: HtmlPluginData): HtmlTagObject[] {
    const include = options.include;
    /** prerender */
    const renderLink = (include?.hosts || []).map(r => {
      const attributes = {
        rel: RelType.prerender,
        href: r
      }
      return {
        tagName: 'link',
        voidTag: false,
        meta: {},
        attributes
      }
    });
    return renderLink;
  }

  generateConnectLinks(options: ResourceHintOption, compilation: Compilation, htmlPluginData: HtmlPluginData): HtmlTagObject[] {
    const include = options.include;
    /** preconnect */
    const connectLink = (include?.hosts || []).map(c => {
      const attributes = {
        rel: RelType.preconnect,
        href: c,
        crossorigin: ''
      }
      return {
        tagName: 'link',
        voidTag: false,
        meta: {},
        attributes
      }
    });
    return connectLink;
  }

  generateLinks(compilation: Compilation, htmlPluginData: HtmlPluginData): void {
    const optionsArray = this.options;
    const links = optionsArray.reduce<HtmlTagObject[]>((pre, options) => {
      /** 配置需要插入的 html */
      if (!doesHtmlBeIncluded(htmlPluginData.outputName, options.include?.htmls)) {
        return pre.concat([]);
      }

      if ([RelType.preload, RelType.prefetch].includes(options.rel)) {
        const commonLinks = this.generateCommonLinks(options, compilation, htmlPluginData);
        return pre.concat(commonLinks);
      }

      if ([RelType.dnsPrefetch].includes(options.rel)) {
        const dnsLinks = this.generateDNSLinks(options, compilation, htmlPluginData);
        return pre.concat(dnsLinks);
      }

      if ([RelType.prerender].includes(options.rel)) {
        const renderLinks = this.generateRenderLinks(options, compilation, htmlPluginData);
        return pre.concat(renderLinks);
      }

      if ([RelType.preconnect].includes(options.rel)) {
        const connectLinks = this.generateConnectLinks(options, compilation, htmlPluginData);
        return pre.concat(connectLinks);
      }

      return pre.concat([]);
    }, []);

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