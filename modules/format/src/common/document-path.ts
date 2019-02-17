/**
 * DocumentPath is a formatted string.
 * It's used to express the location of the specific value in nested objects.
 * AWS DynamoDB uses the format.
 *
 * For example,
 *   const obj = { users: [ { name: 'shinout' } ] }
 * the DocumentPath to express the location of "shinout" is "users[0].name"
 *
 * Detailed format is written here: http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.Attributes.html#Expressions.Attributes.NestedElements.DocumentPathExamples
 */
export type DocumentPath = string;

/**
 * DotNotationString is also a formatted string to express the location in nested objects.
 * The only difference between DotNotationString and DocumentPath is the way to handle array items.
 * MongoDB uses the format.
 *
 * For example,
 *   const obj = { users: [ { name: 'shinout' } ] }
 * the DotNotationString to express the location of "shinout" is "users.0.name", whereas
 * the DocumentPath to express the location of "shinout" is "users[0].name".
 *
 * Detailed format is written here: http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.Attributes.html#Expressions.Attributes.NestedElements.DocumentPathExamples
 */
export type DotNotationString = string;

type Attribute = string | number;

/**
 * @public
 * Parse DocumentPath into an array of property names.
 */
export function parseDocumentPath(docPath: DocumentPath): Array<Attribute> {
  /*
   * This is workaround for negative lookbehind regular expression.
   * Some JS runtimes haven't implemented the feature determined by ES2018.
   * "$$$" is a temporary replacer of ".".
   */
  return docPath
    .split(/\\./)
    .join("$$$")
    .split(/[.[]/)
    .map(attribute =>
      attribute.charAt(attribute.length - 1) === "]"
        ? parseInt(attribute.slice(0, -1))
        : unescapePathDelimiter(attribute.split("$$$").join("\\."))
    );
}

/**
 * @public
 * Create DocumentPath from arguments.
 */
export function createDocumentPath(...attributes: Attribute[]): DocumentPath {
  const joined = attributes.reduce(
    (docPath, attr) =>
      typeof attr === "string"
        ? `${docPath}.${escapePathDelimiter(attr)}`
        : `${docPath}[${attr.toString()}]`,
    ""
  );
  // @ts-ignore "joined" must be string here.
  return joined.charAt(0) === "." ? joined.slice(1) : joined;
}

/**
 * @public
 * Convert DocumentPath to DotNotationString, expected to be used to pass to MongoDB.
 */
export function convertToDotNotationString(
  docPath: DocumentPath
): DotNotationString {
  return docPath.replace(/\[(\d{1,})\]/g, ".$1") as DotNotationString;
}

function escapePathDelimiter(attr: string): string {
  return attr.replace(/\./g, "\\.");
}

function unescapePathDelimiter(attr: string): string {
  return attr.replace(/\\\./, ".");
}

/**
 * @public
 * Get the value in the object at the DocumentPath.
 */
export function getNestedValueWithoutType(
  obj: Object,
  docPath: DocumentPath,
  noNullAccess?: boolean
): any {
  const keys = parseDocumentPath(docPath);
  let currentObj = obj;
  for (const key of keys) {
    try {
      // @ts-ignore allow nullable access here.
      currentObj = currentObj[key];
    } catch (e) {
      if (noNullAccess) {
        throw new Error(
          `Cannot get value by the document path: "${docPath}". The property "${key}" is not found in the upper undefined object.`
        );
      }
      return undefined;
    }
  }
  return currentObj;
}

/**
 * @public
 * Check if the object has the DocumentPath.
 */
export function hasOwnNestedProperty(
  obj: Object,
  docPath: DocumentPath
): boolean {
  let currentObj = obj;
  for (const key of parseDocumentPath(docPath)) {
    if (!currentObj || !currentObj.hasOwnProperty(key)) {
      return false;
    }
    // @ts-ignore this access must be safe.
    currentObj = currentObj[key];
  }
  return true;
}
