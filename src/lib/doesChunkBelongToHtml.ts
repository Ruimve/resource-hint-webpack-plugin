import HtmlWebpackPlugin from "html-webpack-plugin";
import { Chunk } from 'webpack';

function doesChunkBelongToHtml(
  chunk: Chunk,
  htmlPluginOptions: HtmlWebpackPlugin.ProcessedOptions | undefined
) {
  const chunkName = recursiveChunkEntryName(chunk);
  return isChunksFiltered(chunkName, htmlPluginOptions?.chunks, htmlPluginOptions?.excludeChunks);
}

function recursiveChunkEntryName (chunk: Chunk) {
  const [chunkGroup] = chunk.groupsIterable
  return _recursiveChunkGroup(chunkGroup)
}

function _recursiveChunkGroup (chunkGroup) {
  if (chunkGroup.constructor.name === 'Entrypoint') {
    return chunkGroup.name;
  } else {
    const [chunkParent] = chunkGroup.getParents();
    return _recursiveChunkGroup(chunkParent);
  }
}

function isChunksFiltered(chunkName?: string, includedChunks?: 'all' | string[], excludedChunks?: string[]) {
  if (includedChunks === 'all' || typeof includedChunks === undefined) {
    return true;
  }

  if (Array.isArray(includedChunks) && (typeof chunkName === 'undefined' || !includedChunks.includes(chunkName))) {
    return false
  }
  if (Array.isArray(excludedChunks) && (typeof chunkName === 'undefined' || excludedChunks.includes(chunkName))) {
    return false
  }
  return true
}

export {
  doesChunkBelongToHtml
}