import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const directionsMap: Record<string, string> = { L: "0", R: "1" };

const part1 = (rawInput: string): number => {
  const [directionsString, elementsString] = parseInput(rawInput).split("\n\n");
  const directions = directionsString
    .replace(/[LR]/g, (m) => directionsMap[m])
    .split("")
    .map(Number);
  const elements = elementsString.split("\n").reduce((a: Record<string, string[]>, b) => {
    const [key, mapString] = b.split(" = ");
    const map = mapString.replace(/[()]/g, "").split(", ");
    return { ...a, [key]: map };
  }, {});
  let position = "AAA";
  let step = 0;
  while (position !== "ZZZ") {
    for (const direction of directions) {
      position = elements[position][direction];
      step += 1;
      if (position === "ZZZ") {
        break;
      }
    }
  }
  return step;
};

const part2 = (rawInput: string): number => {
  const [directionsString, elementsString] = parseInput(rawInput).split("\n\n");
  const directions = directionsString
    .replace(/[LR]/g, (m) => directionsMap[m])
    .split("")
    .map(Number);
  const elements = elementsString.split("\n").reduce((a: Record<string, string[]>, b) => {
    const [key, mapString] = b.split(" = ");
    const map = mapString.replace(/[()]/g, "").split(", ");
    return { ...a, [key]: map };
  }, {});
  const AKeys = Object.keys(elements).filter((key) => key[2] === "A");
  const AZSteps = AKeys.map((key) => {
    let position = key;
    let step = 0;
    while (position[2] !== "Z") {
      for (const direction of directions) {
        position = elements[position][direction];
        step += 1;
        if (position[2] === "Z") {
          break;
        }
      }
    }
    return step;
  });
  const gcd = (a: number, b: number): number => (b == 0 ? a : gcd(b, a % b));
  const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;
  const lcmAll = (ns: number[]) => ns.reduce(lcm, 1);
  return lcmAll(AZSteps);
};

run({
  part1: {
    tests: [
      {
        input: `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
