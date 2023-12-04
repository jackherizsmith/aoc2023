import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");
  const baseNumbers = input.map((str) => {
    const strNumbers = str.replace(/\D/g, "");
    return Number(strNumbers[0] + strNumbers[strNumbers.length - 1]);
  });
  return baseNumbers.reduce((a, b) => a + b, 0);
};

const stringNumbers: Record<string, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");
  const searchStrings = Object.keys(stringNumbers);
  const baseNumbers = input.map((str) => {
    let firstIndex = str.length;
    let lastIndex = 0;
    let firstNum: string = "";
    let lastNum: string = "";
    for (const subStr of searchStrings) {
      const thisStrFirstIdx = str.indexOf(subStr);
      const thisStrLastIdx = str.lastIndexOf(subStr);
      if (thisStrFirstIdx > -1 && thisStrFirstIdx <= firstIndex) {
        firstIndex = thisStrFirstIdx;
        firstNum = stringNumbers[subStr];
      }
      if (thisStrLastIdx >= lastIndex) {
        lastIndex = thisStrLastIdx;
        lastNum = stringNumbers[subStr];
      }
    }
    return Number(firstNum + lastNum);
  });
  return baseNumbers.reduce((a, b) => a + b, 0);
};

run({
  part1: {
    tests: [
      {
        input: `1abc2
        pqr3stu8vwx
        a1b2c3d4e5f
        treb7uchet`,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `two1nine
        eightwothree
        abcone2threexyz
        xtwone3four
        4nineeightseven2
        zoneight234
        7pqrstsixteen`,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
