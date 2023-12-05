import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

function isSymbol(n: string) {
  return n !== "." && isNaN(parseFloat(n));
}

function isNumber(n: string) {
  return !isNaN(parseFloat(n)) && isFinite(+n);
}

type NumberData = {
  value: number;
  startX: number;
  startY: number;
  length: number;
};

type SymbolPosition = {
  character: string;
  x: number;
  y: number;
};

function getSymbolPositions(rows: string[]) {
  return rows
    .flatMap((row, y) => {
      const rowCharacters = row.split("");
      return rowCharacters.map((character, x) => {
        if (isSymbol(character)) {
          return { character, x, y };
        }
      });
    })
    .filter(Boolean) as SymbolPosition[];
}

function getNumberPositions(data: NumberData[], row: string, y: number) {
  let rowCharacters = row.split("");
  let currentNumber = "";
  rowCharacters.forEach((character, x, self) => {
    const characterIsNumber = isNumber(character);
    const isEndOfRow = self.length === x + 1;
    const hasNumberToAdd = currentNumber.length > 0;
    if (characterIsNumber) {
      currentNumber += character;
    }
    if ((!characterIsNumber || isEndOfRow) && hasNumberToAdd) {
      data.push({
        value: Number(currentNumber),
        startX: x - currentNumber.length,
        startY: y,
        length: currentNumber.length,
      });
      currentNumber = "";
    }
  });
  return data;
}

function isAdjacent(symbolX: number, symbolY: number, numberX: number, numberY: number, numberLength: number) {
  return (
    symbolX >= numberX - 1 && symbolX <= numberX + numberLength && symbolY >= numberY - 1 && symbolY <= numberY + 1
  );
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");

  const symbolPositions = getSymbolPositions(input);
  const numberData = input.reduce(getNumberPositions, []);

  const neighbouredNumbers = numberData.filter(({ startX, startY, length }) => {
    return symbolPositions.some(({ x, y }) => {
      return isAdjacent(x, y, startX, startY, length);
    });
  });
  return neighbouredNumbers.reduce((a, b) => a + b.value, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).split("\n");

  const symbolPositions = getSymbolPositions(input).filter(({ character }) => character === "*");
  const numberData = input.reduce(getNumberPositions, []);

  const relevantNumbers = symbolPositions.reduce((numbers: number[][], { x, y }) => {
    const numberNeighbours = numberData.filter(({ startX, startY, length }) => {
      return isAdjacent(x, y, startX, startY, length);
    });
    if (numberNeighbours.length > 1) {
      numbers.push(numberNeighbours.map(({ value }) => value));
    }
    return numbers;
  }, []);
  return relevantNumbers.reduce((a, b) => a + b.reduce((c, d) => c * d), 0);
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
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
