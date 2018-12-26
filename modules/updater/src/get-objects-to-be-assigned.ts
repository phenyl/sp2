import { parseDocumentPath, DocumentPath } from "@sp2/format";

export function getObjectsToBeAssigned(
  obj: Object,
  docPath: DocumentPath
): Array<Object> {
  const ret = [obj];
  const keys = parseDocumentPath(docPath);
  keys.pop();
  let currentObj = obj;
  for (const key of keys) {
    // @ts-ignore currentObj must be an object here.
    currentObj = currentObj[key] || {};
    ret.push(currentObj);
  }
  return ret;
}
