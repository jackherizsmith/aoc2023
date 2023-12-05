import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

function getWinners(card: string): number[] {
  const numbers = card.split(": ")[1];
  const [win, user] = numbers.split(" | ");
  const winningNumbers = win.split(" ").filter(Boolean);
  const usersNumbers = user.split(" ").filter(Boolean);
  return winningNumbers.filter((winner) => usersNumbers.includes(winner)).map(Number);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");
  const cardScores = input.map((card) => {
    const winners = getWinners(card);
    return winners.length ? Math.pow(2, winners.length - 1) : 0;
  });
  return cardScores.reduce((a, b) => a + b, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");
  const initialCards: Record<string, number> = {};
  for (const n in input) {
    initialCards[`${+n + 1}`] = 1;
  }

  const cardsCount = input.reduce((cards, card, cardIndex) => {
    const winners = getWinners(card);
    const cardNumber = cardIndex + 1;
    for (const nextCardRelativeIndex in winners) {
      const nextCardNumber = cardNumber + +nextCardRelativeIndex + 1;
      cards[nextCardNumber] += cards[cardNumber];
    }
    return cards;
  }, initialCards);
  return Object.values(cardsCount).reduce((a, b) => a + b, 0);
};

run({
  part1: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
        Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
        Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
        Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
        Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
        Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
        Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
        Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
        Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
        Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
        Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
