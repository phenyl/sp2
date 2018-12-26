export type SortNotation = { [docPath: string]: 1 | -1 };

export function sortByNotation<T extends Object>(
  arr: Array<T>,
  sortNotation: SortNotation
): Array<T> {
  const newArr = arr.slice();
  const sortDnStrs = Object.keys(sortNotation);
  newArr.sort((a, b) => {
    for (const sortDnStr of sortDnStrs) {
      // @ts-ignore a must be Object.
      const valA = a[sortDnStr];
      // @ts-ignore b must be Object.
      const valB = b[sortDnStr];
      if (valA !== valB) {
        const direction = sortNotation[sortDnStr];
        return valA > valB ? direction : (direction ^ -1) + 1;
      }
    }
    return 0;
  });
  return newArr;
}
