import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

type RatioMap = { destination: number; source: number; length: number };

function getRatioMaps(maps: string[]) {
  const ruleSets = maps.flatMap((map) => {
    return map
      .split(/[:\n|\n\n]/)
      .map((text) => text.trim())
      .filter(Boolean);
  });
  const ruleMaps = ruleSets.reduce((maps: RatioMap[][], text) => {
    if (text.includes("map")) {
      maps.push([]);
    } else {
      const [destination, source, length] = text.split(" ");
      maps[maps.length - 1].push({ destination: +destination, source: +source, length: +length });
    }
    return maps;
  }, []);
  return ruleMaps;
}

function getSeedLocations(seeds: number[], ratioMaps: RatioMap[][]) {
  return seeds.map((seed) => {
    let mappedId = seed;
    ratioMaps.forEach((maps) => {
      const rule = maps.find(({ source, length }) => {
        return mappedId >= source && mappedId < source + length;
      });
      if (rule) {
        mappedId += rule.destination - rule.source;
      }
    });
    return mappedId;
  });
}

const part1 = (rawInput: string): number => {
  const input = parseInput(rawInput).split("\n\n");
  const seeds = input.shift()?.split(": ")[1].split(" ").map(Number) || [];
  const ratioMaps = getRatioMaps(input);
  const locations = getSeedLocations(seeds, ratioMaps);
  return Math.min(...locations);
};

const part2 = (rawInput: string): number => {
  const input = parseInput(rawInput).split("\n\n");
  let seedData = input.shift()?.split(": ")[1].split(" ").map(Number) || [];
  let minLocation = 10000000;
  const ratioMaps = getRatioMaps(input);
  while (seedData.length) {
    const [start, length] = seedData.splice(0, 2);
    const seeds = Array.from({ length }, (_, i) => i + start);
    const locations = getSeedLocations(seeds, ratioMaps);
    const thisMinLocation = Math.min(...locations);
    if (thisMinLocation < minLocation) {
      minLocation = thisMinLocation;
    }
  }
  return minLocation;
};

run({
  part1: {
    tests: [
      {
        input: `seeds: 79 14 55 13

        seed-to-soil map:
        50 98 2
        52 50 48
        
        soil-to-fertilizer map:
        0 15 37
        37 52 2
        39 0 15
        
        fertilizer-to-water map:
        49 53 8
        0 11 42
        42 0 7
        57 7 4
        
        water-to-light map:
        88 18 7
        18 25 70
        
        light-to-temperature map:
        45 77 23
        81 45 19
        68 64 13
        
        temperature-to-humidity map:
        0 69 1
        1 0 69
        
        humidity-to-location map:
        60 56 37
        56 93 4`,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `seeds: 79 14 55 13

        seed-to-soil map:
        50 98 2
        52 50 48
        
        soil-to-fertilizer map:
        0 15 37
        37 52 2
        39 0 15
        
        fertilizer-to-water map:
        49 53 8
        0 11 42
        42 0 7
        57 7 4
        
        water-to-light map:
        88 18 7
        18 25 70
        
        light-to-temperature map:
        45 77 23
        81 45 19
        68 64 13
        
        temperature-to-humidity map:
        0 69 1
        1 0 69
        
        humidity-to-location map:
        60 56 37
        56 93 4`,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
