import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

type HandData = {
  value: string;
  bid: string;
  score: number;
};

const calculateScore = (regularCards: number[], wildcardCount: number): number => {
  const firstCardCount = regularCards[0] + wildcardCount;
  const twoOfSecondCard = regularCards[1] === 2;
  if (firstCardCount > 5) {
    throw new Error("There cannot be more than 5 of a kind, including wildcards");
  }
  switch (firstCardCount) {
    case 5:
      return 7;
    case 4:
      return 6;
    case 3:
      return twoOfSecondCard ? 5 : 4;
    case 2:
      return twoOfSecondCard ? 3 : 2;
  }
  return 1;
};

const getHandData = (hand: string, wildcard?: string) => {
  const [value, bid] = hand.split(" ");
  let cardsCount = value
    .split("")
    .reduce((counts: Record<string, number>, card) => ({ ...counts, [card]: (counts[card] || 0) + 1 }), {});
  let wildcardCount = 0;
  if (wildcard && cardsCount[wildcard]) {
    wildcardCount = cardsCount[wildcard];
    cardsCount = { ...cardsCount, [wildcard]: 0 };
  }
  const cardCounts = Object.values(cardsCount).sort((a, b) => b - a);
  const score = calculateScore(cardCounts, wildcardCount);
  return { value, bid, score };
};

const byScoreAndValue = (a: HandData, b: HandData) => {
  return a.score === b.score ? parseInt(a.value, 15) - parseInt(b.value, 15) : a.score - b.score;
};

const CHARS_TO_NUMS_1: Record<string, string> = { A: "E", K: "D", Q: "C", J: "B", T: "A" };
const part1 = (rawInput: string): number => {
  const input = parseInput(rawInput)
    .replace(/[AKQJT]/g, (m) => CHARS_TO_NUMS_1[m])
    .split("\n");
  const handsData = input.map((hand) => getHandData(hand)).sort(byScoreAndValue);
  return handsData.reduce((sum, { bid }, i) => sum + +bid * (i + 1), 0);
};

const CHARS_TO_NUMS_2: Record<string, string> = { A: "E", K: "D", Q: "C", J: "0", T: "A" };
const part2 = (rawInput: string): number => {
  const input = parseInput(rawInput)
    .replace(/[AKQJT]/g, (m) => CHARS_TO_NUMS_2[m])
    .split("\n");
  const handsData = input.map((hand) => getHandData(hand, "0")).sort(byScoreAndValue);
  return handsData.reduce((sum, { bid }, i) => sum + +bid * (i + 1), 0);
};

run({
  part1: {
    tests: [
      {
        input: `
AAAAA 7
AAAAK 6
AAAKK 5
AAAKQ 4
AAKKQ 3
AAKQT 2
AKQT9 1`,
        expected: 140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
AAAAA 7
AAAAJ 7
AAAJJ 7
AAAAK 6
AAAJK 6
AAJJK 6
AAAKK 5
AAJKK 5
AAAKQ 4
AAJKQ 4
AJJKQ 4
AAKKQ 3
AAKQT 2
AJKQT 2
AKQT9 1
        `,
        expected: 672,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
