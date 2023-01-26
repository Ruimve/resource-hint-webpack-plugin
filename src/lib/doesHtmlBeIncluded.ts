function doesHtmlBeIncluded(outputHtml: string, htmlBeIncluded?: string[]) {
  if(typeof htmlBeIncluded === 'undefined'){
    return true;
  }else{
    return htmlBeIncluded.includes(outputHtml);
  }
}

export {
  doesHtmlBeIncluded
}