import path from 'path';
function doesScript(file: string) {
  const url = new URL(file, 'https://github.com');
  const extension = path.extname(url.pathname);

  if(extension === '.js') {
    return true;
  }

  return false;
}

export {
  doesScript
}