import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const availableBlocks: Record<string, number> = {
  red: 12,
  green: 13,
  blue: 14,
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");
  const playableGames = input.map((game, i) => {
    const rounds = game.split(": ")[1].split("; ");
    const hasSomeUnplayableRounds = rounds.some((round) => {
      const cubeCounts = round.split(", ");
      return cubeCounts.some((cube) => {
        const [cubeCount, colour] = cube.split(" ");
        return availableBlocks[colour] < Number(cubeCount);
      });
    });
    return hasSomeUnplayableRounds ? 0 : i + 1;
  });
  return playableGames.reduce((a, b) => a + b, 0);
};

type CubeColour = "red" | "blue" | "green";

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");
  const gamePowers: number[] = input.map((game) => {
    const rounds = game.split(": ")[1].split("; ");
    const minCubeCounts = rounds.reduce(
      (runningCubeCounts: Record<CubeColour, number>, round) => {
        const cubeCounts = round.split(", ");
        for (const cube of cubeCounts) {
          const [cubeCount, colour] = cube.split(" ");
          if (Number(cubeCount) > runningCubeCounts[colour as CubeColour]) {
            runningCubeCounts = {
              ...runningCubeCounts,
              [colour]: Number(cubeCount),
            };
          }
        }
        return runningCubeCounts;
      },
      { red: 0, blue: 0, green: 0 },
    );
    return minCubeCounts.red * minCubeCounts.blue * minCubeCounts.green;
  });
  return gamePowers.reduce((a, b) => a + b, 0);
};

run({
  part1: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
        Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
        Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
        Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
        Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
        Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
        Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
        Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
        Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
