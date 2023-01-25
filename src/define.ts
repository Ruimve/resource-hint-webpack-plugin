import HtmlWebpackPlugin from "html-webpack-plugin";

export enum RelType {
  preload = 'preload',
  prefetch = 'prefetch'
}

export enum IncludeType {
  initial = 'initial',
  asyncChunks = 'asyncChunks'
}

export interface IncludeOption {
  type: IncludeType;
  chunks?: string[];
  entries?: string[];
}

export type Include = IncludeType | IncludeOption;

export interface ResourceHintOption {
  rel: RelType;
  include?: Include;
  excludeHtmlNames?: string[];
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