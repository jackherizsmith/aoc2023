export const partition = <T>(array: T[], callback: (element: T, index?: number, self?: T[]) => boolean) => {
  return array.reduce(
    (result: T[][], element: T, i) => {
      callback(element, i, array) ? result[0].push(element) : result[1].push(element);
      return result;
    },
    [[], []],
  );
};
