import run from "aocrunner";
import { partition } from "../utils/index.js";

const parseInput = (rawInput: string) => rawInput;

type Rules = {
  FIVE: (hand: HandData) => boolean;
  FOUR: (hand: HandData) => boolean;
  FULL: (hand: HandData) => boolean;
  THREE: (hand: HandData) => boolean;
  TWOPAIR: (hand: HandData) => boolean;
  PAIR: (hand: HandData) => boolean;
};

const RULES_1: Rules = {
  FIVE: (hand: HandData) => Object.values(hand).includes(5),
  FOUR: (hand: HandData) => Object.values(hand).includes(4),
  FULL: (hand: HandData) => Object.values(hand).includes(3) && Object.values(hand).includes(2),
  THREE: (hand: HandData) => Object.values(hand).includes(3),
  TWOPAIR: (hand: HandData) => Object.values(hand).filter((card) => card === 2).length === 2,
  PAIR: (hand: HandData) => Object.values(hand).includes(2),
};

const hasXCards = (card: number | string, wilds: number, x: number) => typeof card === "number" && wilds + card === x;
const hasHand = (hand: HandData, firstCount: number, secondCount?: number) => {
  const wildcards = Number(hand["1"] || 0);
  const remainingCards = { ...hand, "1": 0 };

  if (!secondCount) {
    return Object.values(remainingCards).some((card) => hasXCards(card, wildcards, firstCount));
  }

  const first = Object.entries(remainingCards).find(([, card]) => hasXCards(card, wildcards, firstCount));
  if (!first) {
    return false;
  }
  const remainingWild = firstCount - +first[1] - wildcards;
  const handWithoutFirstCard = { ...remainingCards, [first[0]]: 0 };
  return Object.values(handWithoutFirstCard).some((card) => hasXCards(card, remainingWild, secondCount));
};

const RULES_2: Rules = {
  FIVE: (hand: HandData) => hasHand(hand, 5),
  FOUR: (hand: HandData) => hasHand(hand, 4),
  FULL: (hand: HandData) => hasHand(hand, 3, 2),
  THREE: (hand: HandData) => hasHand(hand, 3),
  TWOPAIR: (hand: HandData) => hasHand(hand, 2, 2),
  PAIR: (hand: HandData) => hasHand(hand, 2),
};

type HandData = {
  value: string;
  bid: string;
  [key: string]: string | number;
};

const getHandsData = (hand: string) => {
  const [value, bid] = hand.split(" ");
  const cardCounts = value
    .split("")
    .reduce((counts: Record<string, number>, card) => ({ ...counts, [card]: (counts[card] || 0) + 1 }), {});
  return { value, bid, ...cardCounts };
};

const byValue = (a: HandData, b: HandData) => parseInt(b.value, 15) - parseInt(a.value, 15);

const getRankedHands = (handsData: HandData[], rulesObj: Rules) => {
  const [fives, notFives] = partition(handsData, rulesObj.FIVE);
  const [fours, notFours] = partition(notFives, rulesObj.FOUR);
  const [full, notFull] = partition(notFours, rulesObj.FULL);
  const [threes, notThrees] = partition(notFull, rulesObj.THREE);
  const [twoPairs, notTwoPairs] = partition(notThrees, rulesObj.TWOPAIR);
  const [pairs, notPairs] = partition(notTwoPairs, rulesObj.PAIR);
  return [
    ...fives.sort(byValue),
    ...fours.sort(byValue),
    ...full.sort(byValue),
    ...threes.sort(byValue),
    ...twoPairs.sort(byValue),
    ...pairs.sort(byValue),
    ...notPairs.sort(byValue),
  ].reverse();
};

const CHARS_TO_NUMS_1: Record<string, string> = {
  A: "E",
  K: "D",
  Q: "C",
  J: "B",
  T: "A",
};

const part1 = (rawInput: string): number => {
  const input = parseInput(rawInput)
    .replace(/[AKQJT]/g, (m) => CHARS_TO_NUMS_1[m])
    .split("\n");
  const handsData = input.map(getHandsData);
  const rankedHands = getRankedHands(handsData, RULES_1);
  return rankedHands.reduce((sum, { bid }, i) => sum + +bid * (i + 1), 0);
};

const CHARS_TO_NUMS_2: Record<string, string> = {
  A: "E",
  K: "D",
  Q: "C",
  J: "1",
  T: "A",
};

const part2 = (rawInput: string): number => {
  const input = parseInput(rawInput)
    .replace(/[AKQJT]/g, (m) => CHARS_TO_NUMS_2[m])
    .split("\n");
  const handsData = input.map(getHandsData);
  const rankedHands = getRankedHands(handsData, RULES_2);
  return rankedHands.reduce((sum, { bid }, i) => sum + +bid * (i + 1), 0);
};

run({
  part1: {
    tests: [
      {
        input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
        `,
        expected: 5905,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
