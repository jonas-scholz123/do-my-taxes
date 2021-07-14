export function replaceDictKeys(dict, toReplace, replaceWith) {
  for (const key in dict) {
    if (dict[key] === toReplace) {
      dict[key] = replaceWith
    }
  }
}