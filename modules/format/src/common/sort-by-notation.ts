export type SortDirection = 1 | -1;
export type SortNotation = SortDirection | { [docPath: string]: SortDirection };

export function sortByNotation<T>(arr: T[], sortNotation: SortNotation): T[] {
  const newArr = arr.slice();
  if (sortNotation === 1 || sortNotation === -1) {
    return sortByDirection(arr, sortNotation);
  }

  const sortDnStrs = Object.keys(sortNotation);
  newArr.sort((a, b) => {
    for (const sortDnStr of sortDnStrs) {
      const direction = sortNotation[sortDnStr];
      const comparisonResult = compareByDirection(
        // @ts-ignore a must be Object.
        a[sortDnStr],
        // @ts-ignore a must be Object.
        b[sortDnStr],
        direction
      );
      if (comparisonResult !== 0) return comparisonResult;
    }
    return 0;
  });
  return newArr;
}

function sortByDirection<T>(arr: T[], direction: SortDirection): T[] {
  const newArr = arr.slice();
  newArr.sort((a, b) => {
    return compareByDirection(a, b, direction);
  });
  return newArr;
}

function compareByDirection<T>(
  a: T,
  b: T,
  direction: SortDirection
): 1 | -1 | 0 {
  if (a !== b) {
    return (a > b ? direction : (direction ^ -1) + 1) as 1 | -1;
  }
  return 0;
}
