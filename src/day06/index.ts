import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

function countOpportunities({ time, distance }: { time: number; distance: number }) {
  let firstWinningTriggerMs = 0;
  let firstWinningDistance = 0;
  while (firstWinningDistance <= distance) {
    firstWinningTriggerMs += 1;
    const remainingTime = time - firstWinningTriggerMs;
    firstWinningDistance = remainingTime * firstWinningTriggerMs;
  }
  let lastWinningTriggerMs = time;
  let lastWinningDistance = 0;
  while (lastWinningDistance <= distance) {
    lastWinningTriggerMs -= 1;
    const remainingTime = time - lastWinningTriggerMs;
    lastWinningDistance = remainingTime * lastWinningTriggerMs;
  }
  return lastWinningTriggerMs - firstWinningTriggerMs + 1;
}

const part1 = (rawInput: string): number => {
  const [timeString, distanceString] = parseInput(rawInput).split("\n");
  const times = timeString.match(/\d+/g)?.map(Number) || [];
  const distances = distanceString.match(/\d+/g)?.map(Number) || [];
  const matches = times.map((time, i) => ({ time, distance: distances[i] }));
  const oppounityCounts = matches.map(countOpportunities);
  return oppounityCounts.reduce((a, b) => a * b, 1);
};

const part2 = (rawInput: string): number => {
  const [timeString, distanceString] = parseInput(rawInput).split("\n");
  const time = +(timeString.match(/\d+/g) || []).reduce((a, b) => a + b);
  const distance = +(distanceString.match(/\d+/g) || []).reduce((a, b) => a + b);
  const opportunities = countOpportunities({ time, distance });
  return opportunities;
};

run({
  part1: {
    tests: [
      {
        input: `Time:      7  15   30
        Distance:  9  40  200`,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Time:      7  15   30
      Distance:  9  40  200`,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
