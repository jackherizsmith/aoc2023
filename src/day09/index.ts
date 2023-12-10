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

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
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
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
