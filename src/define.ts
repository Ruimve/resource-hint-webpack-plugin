import HtmlWebpackPlugin from "html-webpack-plugin";

export enum RelType {
  preload = 'preload',
  prefetch = 'prefetch',
  dnsPrefetch = 'dns-prefetch',
  prerender = 'prerender',
  preconnect = 'preconnect'
}

export enum IncludeType {
  initial = 'initial',
  allChunks = 'allChunks',
  allAssets = 'allAssets',
  asyncChunks = 'asyncChunks'
}

export interface IncludeOption {
  type?: IncludeType;
  hosts?: string[];
  chunks?: string[];
  entries?: string[];
  htmls?: string[];
}

export interface ResourceHintOption {
  rel: RelType;
  include?: IncludeOption;
}

export interface HtmlPluginData {
  assets: {
    publicPath: string;
    js: string[];
    css: string[];
    favicon?: string | undefined;
    manifest?: string | undefined;
  };
  outputName: string;
  plugin: HtmlWebpackPlugin;
}