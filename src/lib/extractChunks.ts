import { ScriptLoadOption, Include, IncludeType } from '../define';
import { Chunk, Compilation } from "webpack";

function isAsync(chunk: Chunk) {
  return !chunk.canBeInitial();
}

function getChunkEntryName(chunk: Chunk) {
  const entryOptions = chunk.getEntryOptions();
  return entryOptions?.name;
}

function extractChunks(chunks: Chunk[], options: ScriptLoadOption) {
  const { include = IncludeType.asyncChunks } = options;

  let includeType: IncludeType;
  let includeChunks: string[] | undefined;
  let includeEntries: string[] | undefined;

  if (typeof include === 'object') {
    includeType = include.type;
    includeChunks = include.chunks;
    includeEntries = include.entries;
  } else {
    includeType = include;
  }

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

  return chunks;
}

export {
  extractChunks
}