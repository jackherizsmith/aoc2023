import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

function isNumeric(n: string) {
  return !isNaN(parseFloat(n)) && isFinite(+n);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");
  const symbolsMap = input.reduce((symbols, row) => {
    const rowCharaters = row.split("");
    console.log(rowCharaters.map(isNumeric));
    return symbols;
  }, []);
  return;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `
        467..114..
        ...*......
        ..35..633.
        ......#...
        617*......
        .....+.58.
        ..592.....
        ......755.
        ...$.*....
        .664.598..`,
        expected: 4361,
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
  onlyTests: true,
});
