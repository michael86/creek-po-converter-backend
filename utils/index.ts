export const sanitizeToHtmlEntities = (input: string): string => {
  // Define a mapping of special characters to their corresponding HTML entities
  const entityMap: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
    "{": "&#123;",
    "}": "&#125;",
    "|": "&#124;",
    "\\": "&#92;",
    "[": "&#91;",
    "]": "&#93;",
    "+": "&#43;",
    "-": "&#45;",
    "*": "&#42;",
    "%": "&#37;",
    "^": "&#94;",
    "~": "&#126;",
    ";": "&#59;",
    ":": "&#58;",
    ",": "&#44;",
    ".": "&#46;",
    "?": "&#63;",
    "!": "&#33;",
    "@": "&#64;",
    "#": "&#35;",
    $: "&#36;",
    _: "&#95;",
    "(": "&#40;",
    ")": "&#41;",
    " ": "&#32;",
    // Add more special characters and their corresponding HTML entities as needed
  };

  // Use regular expressions to replace special characters with their HTML entities
  return input.replace(/[&<>"'\/`={}|\\[\]+\-*%^~;:,.?!\@#$() ]/g, (s: string) => {
    return entityMap[s];
  });
};
