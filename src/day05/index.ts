import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

type RatioMap = { destination: number; source: number; length: number };
type SeedsRange = { start: number; length: number };

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
    maps[maps.length - 1] = maps[maps.length - 1].sort((a, b) => a.source - b.source);
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

function getNearestSeedLocationsViaRange(seedsRanges: SeedsRange[], ratioMaps: RatioMap[][]) {
  return seedsRanges.map((seedRange) => {
    let mappedIdRanges = [seedRange];
    ratioMaps.forEach((maps) => {
      let nextMappedIdRanges: SeedsRange[] = [];
      mappedIdRanges.forEach(({ start, length }) => {
        let nextInterestingSeed = start;
        let remainingSeedsCount = length;
        while (remainingSeedsCount > 0) {
          const seedInRange = maps.find(
            (map) => nextInterestingSeed >= map.source && nextInterestingSeed < map.source + map.length,
          );

          if (seedInRange) {
            const relevantRange = seedInRange.source + seedInRange.length - nextInterestingSeed;
            const mappedStart = nextInterestingSeed + (seedInRange.destination - seedInRange.source);
            nextMappedIdRanges.push({ start: mappedStart, length: Math.min(remainingSeedsCount, relevantRange) });
            remainingSeedsCount -= relevantRange;
            nextInterestingSeed += relevantRange;
            continue;
          }

          const nextRange = maps.find(
            (map) =>
              map.source > nextInterestingSeed && map.source + map.length < nextInterestingSeed + remainingSeedsCount,
          );

          if (nextRange) {
            const relevantRange = nextRange.source - nextInterestingSeed;
            nextMappedIdRanges.push({ start: nextInterestingSeed, length: relevantRange });
            remainingSeedsCount -= relevantRange;
            nextInterestingSeed += relevantRange;
            continue;
          }

          const relevantRange = remainingSeedsCount;
          nextMappedIdRanges.push({ start: nextInterestingSeed, length: relevantRange });
          remainingSeedsCount -= relevantRange;
          nextInterestingSeed += relevantRange;
        }
      });
      mappedIdRanges = [...nextMappedIdRanges];
    });
    return Math.min(...mappedIdRanges.map((a) => a.start));
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
  const seedsData = input.shift()?.split(": ")[1].split(" ").map(Number) || [];
  const seedsRanges = seedsData.reduce(
    (ranges: SeedsRange[], data, i) => (i % 2 === 0 ? [...ranges, { start: data, length: seedsData[i + 1] }] : ranges),
    [],
  );
  const ratioMaps = getRatioMaps(input);
  const locations = getNearestSeedLocationsViaRange(seedsRanges, ratioMaps);
  return Math.min(...locations);
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
