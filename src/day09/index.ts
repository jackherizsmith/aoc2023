import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const getNextDiff = (array: number[]): number => {
  if (array.length === 2) {
    return array[0] - array[1];
  }
  const nextDiffs = array.map((value, i) => value - array[i + 1]);
  nextDiffs.pop();
  return getNextDiff(nextDiffs);
};

const part1 = (rawInput: string): number => {
  const input = parseInput(rawInput).split("\n");
  const endValues = input.map((valuesString) => {
    const values = valuesString.split(" ").map(Number).reverse();
    const components = [values[0]];
    let i = 2;
    while (i < values.length) {
      const nextDiff = getNextDiff(values.slice(0, i));
      if (nextDiff === 0) {
        break;
      }
      components.push(nextDiff);
      i++;
    }
    return components.reduce((a, b) => a + b, 0);
  });
  return endValues.reduce((a, b) => a + b, 0);
};

const getPriorDiff = (array: number[]): number | void => {
  if (array[0] === 0 && array[1] === 0) {
    return;
  }
  if (array.length === 2) {
    return array[1] - array[0];
  }
  const nextDiffs = array.map((value, i) => (array[i + 1] || 0) - value);
  nextDiffs.pop();
  return getPriorDiff(nextDiffs);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");
  const endValues = input.map((valuesString) => {
    const values = valuesString.split(" ").map(Number);
    const components = [values[0]];
    let i = 2;
    while (i < values.length) {
      const nextDiff = getPriorDiff(values.slice(0, i));
      if (typeof nextDiff === "number") {
        components.push(nextDiff);
      } else {
        break;
      }
      i++;
    }
    console.log({ components });
    const reversedComponents = components.reverse();
    const previousComponents = reversedComponents.reduce(
      (array: number[], value, i) => {
        if (i > 0) {
          const previousComponent = value - array[i - 1];
          array.push(previousComponent);
        }
        return array;
      },
      [reversedComponents[0]],
    );
    console.log({ previousComponents });
    return previousComponents[previousComponents.length - 1];
  });
  return endValues.reduce((a, b) => a + b, 0);
};

run({
  part1: {
    tests: [
      {
        input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
