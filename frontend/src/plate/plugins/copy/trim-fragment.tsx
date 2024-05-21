const CF_HTML_FRAGMENT_START = /<html>\r?\n<body>\r?\n<!--StartFragment-->/g;
const CF_HTML_FRAGMENT_END = /<!--EndFragment-->\r?\n<\/body>\r?\n<\/html>/g;
const META = "<meta charset='utf-8'>";

export const trimFragment = (html: string) =>
  html.replace(CF_HTML_FRAGMENT_START, '').replace(CF_HTML_FRAGMENT_END, '').replace(META, '').trim();
