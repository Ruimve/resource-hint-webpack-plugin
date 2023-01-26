import { IncludeOption, IncludeType } from '../define';
import { Chunk, Compilation } from "webpack";

function isAsync(chunk: Chunk) {
  return !chunk.canBeInitial();
}

function getChunkEntryName(chunk: Chunk) {
  const entryOptions = chunk.getEntryOptions();
  return entryOptions?.name;
}

function extractChunks(compilation: Compilation, include: IncludeOption) {
  let chunks = Array.from(compilation.chunks);

  const includeType = include?.type;
  const includeChunks = include?.chunks;
  const includeEntries = include?.entries;

  if (Array.isArray(includeChunks)) {
    chunks = chunks.filter(chunk => chunk.name && includeChunks?.includes(chunk.name));
  }

  if (Array.isArray(includeEntries)) {
    chunks = chunks.filter(
      chunk => {
        const name = getChunkEntryName(chunk);
        return includeEntries?.includes(name!);
      }
    );
  }

  if (includeType === IncludeType.initial) {
    return chunks.filter(chunk => !isAsync(chunk));
  }

  if (includeType === IncludeType.asyncChunks) {
    return chunks.filter(chunk => isAsync(chunk));
  }

  if (includeType === IncludeType.allChunks) {
    return chunks;
  }

  if (includeType === IncludeType.allAssets) {
    return [
      {
        files: Object.keys(compilation.assets)
      }
    ] as unknown as Chunk[];
  }

  return chunks;
}

export {
  extractChunks
}