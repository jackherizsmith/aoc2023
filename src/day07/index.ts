import run from "aocrunner";
import { partition } from "../utils/index.js";

const parseInput = (rawInput: string) => rawInput;

const CHARS_TO_NUMS_1: Record<string, string> = {
  A: "E",
  K: "D",
  Q: "C",
  J: "B",
  T: "A",
};

const RULES_1 = {
  FIVE: (hand: HandData) => Object.values(hand).includes(5),
  FOUR: (hand: HandData) => Object.values(hand).includes(4),
  FULL: (hand: HandData) => Object.values(hand).includes(3) && Object.values(hand).includes(2),
  THREE: (hand: HandData) => Object.values(hand).includes(3),
  TWOPAIR: (hand: HandData) => Object.values(hand).filter((card) => card === 2).length === 2,
  PAIR: (hand: HandData) => Object.values(hand).includes(2),
};

type HandData = {
  value: string;
  bid: string;
  [key: string]: string | number;
};

const BY_VALUE = (a: HandData, b: HandData) => parseInt(b.value, 15) - parseInt(a.value, 15);

const part1 = (rawInput: string): number => {
  const input = parseInput(rawInput)
    .replace(/[AKQJT]/g, (m) => CHARS_TO_NUMS_1[m])
    .split("\n");

  const handsData = input.map((hand) => {
    const [value, bid] = hand.split(" ");
    const cardCounts = value
      .split("")
      .reduce((counts: Record<string, number>, card) => ({ ...counts, [card]: (counts[card] || 0) + 1 }), {});
    return { value, bid, ...cardCounts };
  });

  const [fives, notFives] = partition(handsData, RULES_1.FIVE);
  const [fours, notFours] = partition(notFives, RULES_1.FOUR);
  const [full, notFull] = partition(notFours, RULES_1.FULL);
  const [threes, notThrees] = partition(notFull, RULES_1.THREE);
  const [twoPairs, notTwoPairs] = partition(notThrees, RULES_1.TWOPAIR);
  const [pairs, notPairs] = partition(notTwoPairs, RULES_1.PAIR);
  const rankedHands = [
    ...fives.sort(BY_VALUE),
    ...fours.sort(BY_VALUE),
    ...full.sort(BY_VALUE),
    ...threes.sort(BY_VALUE),
    ...twoPairs.sort(BY_VALUE),
    ...pairs.sort(BY_VALUE),
    ...notPairs.sort(BY_VALUE),
  ].reverse();
  return rankedHands.reduce((a, b, i) => a + +b.bid * (i + 1), 0);
};

const CHARS_TO_NUMS_2: Record<string, string> = {
  A: "E",
  K: "D",
  Q: "C",
  J: "1",
  T: "A",
};

const splitHand = (hand: HandData) => ({ wildcards: Number(hand["1"] || 0), remainingCards: { ...hand, "1": 0 } });
const hasXCards = (card: number | string, wilds: number, x: number) => typeof card === "number" && wilds + card === x;

const RULES_2 = {
  FIVE: (hand: HandData) => {
    const { wildcards, remainingCards } = splitHand(hand);
    return Object.values(remainingCards).some((card) => hasXCards(card, wildcards, 5));
  },
  FOUR: (hand: HandData) => {
    const { wildcards, remainingCards } = splitHand(hand);
    return Object.values(remainingCards).some((card) => hasXCards(card, wildcards, 4));
  },
  FULL: (hand: HandData) => {
    const { wildcards, remainingCards } = splitHand(hand);
    const three = Object.entries(remainingCards).find(([, card]) => hasXCards(card, wildcards, 3));
    if (!three) {
      return false;
    }
    const remainingWild = 3 - +three[1] - wildcards;
    const handWithoutThreeCard = { ...hand, [three[0]]: 0 };
    return Object.values(handWithoutThreeCard).some((card) => hasXCards(card, remainingWild, 2));
  },
  THREE: (hand: HandData) => {
    const { wildcards, remainingCards } = splitHand(hand);
    return Object.values(remainingCards).some((card) => hasXCards(card, wildcards, 3));
  },
  TWOPAIR: (hand: HandData) => {
    const { wildcards, remainingCards } = splitHand(hand);
    const two = Object.entries(remainingCards).find(([, card]) => hasXCards(card, wildcards, 2));
    if (!two) {
      return false;
    }
    const remainingWild = 2 - +two[1] - wildcards;
    const handWithoutTwoCard = { ...hand, [two[0]]: 0 };
    return Object.values(handWithoutTwoCard).some((card) => hasXCards(card, remainingWild, 2));
  },
  PAIR: (hand: HandData) => {
    const { wildcards, remainingCards } = splitHand(hand);
    return Object.values(remainingCards).some((card) => hasXCards(card, wildcards, 2));
  },
};

const part2 = (rawInput: string): number => {
  const input = parseInput(rawInput)
    .replace(/[AKQJT]/g, (m) => CHARS_TO_NUMS_2[m])
    .split("\n");

  const handsData = input.map((hand) => {
    const [value, bid] = hand.split(" ");
    const cardCounts = value
      .split("")
      .reduce((counts: Record<string, number>, card) => ({ ...counts, [card]: (counts[card] || 0) + 1 }), {});
    return { value, bid, ...cardCounts };
  });

  const [fives, notFives] = partition(handsData, RULES_2.FIVE);
  const [fours, notFours] = partition(notFives, RULES_2.FOUR);
  const [full, notFull] = partition(notFours, RULES_2.FULL);
  const [threes, notThrees] = partition(notFull, RULES_2.THREE);
  const [twoPairs, notTwoPairs] = partition(notThrees, RULES_2.TWOPAIR);
  const [pairs, notPairs] = partition(notTwoPairs, RULES_2.PAIR);
  const rankedHands = [
    ...fives.sort(BY_VALUE),
    ...fours.sort(BY_VALUE),
    ...full.sort(BY_VALUE),
    ...threes.sort(BY_VALUE),
    ...twoPairs.sort(BY_VALUE),
    ...pairs.sort(BY_VALUE),
    ...notPairs.sort(BY_VALUE),
  ].reverse();
  console.log(rankedHands.map((a) => a.bid));
  return rankedHands.reduce((a, b, i) => a + +b.bid * (i + 1), 0);
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
AAAAJ 5
AAAKJ 4
AAAKK 32
AJJKQ 3
AAKKQ 22
AJKQT 2
AKQT9 1
        `,
        expected: 5905,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
