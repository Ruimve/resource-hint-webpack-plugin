import { RelType } from '../define';
import path from 'path';

const fonts = ['.eot', '.otf', '.fon', '.font', '.ttf', '.ttc', '.woff', '.woff2'];

interface Attribute {
  [attributeName: string]: string | boolean | null | undefined;
}
function generateAttributes(href: string, rel: RelType) {
  const attributes: Attribute = {
    href,
    rel
  }

  if (rel === RelType.preload) {
    const url = new URL(href, 'https://github.com');
    const extension = path.extname(url.pathname);
    
    if (fonts.includes(extension)) {
      attributes.as = 'font';
      attributes.crossorigin = '';
    }

    if (extension === '.css') {
      attributes.as = 'style';
    }

    if (extension === '.js') {
      attributes.as = 'script';
    }

  }

  return attributes;
}

export {
  generateAttributes
}