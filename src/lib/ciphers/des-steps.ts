/**
 * DES Step-by-Step Logic
 * Accurate implementation of DES capturing all intermediate states for visualization.
 */

export interface SubkeyStep {
  round: number;
  leftHalf: string;
  rightHalf: string;
  shiftedLeft: string;
  shiftedRight: string;
  subkey: string;
}

export interface DESRoundBreakdown {
  round: number;
  L: string; // Input Left
  R: string; // Input Right
  key: string;
  expandedR: string;
  xoredWithKey: string;
  sboxOutput: string;
  fResult: string; // Result of P-box
  xorWithOldLeft: string; // L XOR fResult
  nextL: string; // Resulting Left after swap
  nextR: string; // Resulting Right after swap
  swapped: boolean;
}

export interface DESBreakdown {
  pc1Key: string;
  pc1KeyBinary: string;
  subkeySteps: SubkeyStep[];
  subkeys: string[];
  rounds: DESRoundBreakdown[];
  initialPermutation: string;
  finalPermutation: string;
}

// --- Tables ---

const IP = [
  58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4,
  62, 54, 46, 38, 30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8,
  57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27, 19, 11, 3,
  61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7
];

const IP1 = [
  40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31,
  38, 6, 46, 14, 54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29,
  36, 4, 44, 12, 52, 20, 60, 28, 35, 3, 43, 11, 51, 19, 59, 27,
  34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9, 49, 17, 57, 25
];

const PC1 = [
  57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18,
  10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36,
  63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22,
  14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4
];

const PC2 = [
  14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10,
  23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2,
  41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48,
  44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32
];

const EXP_D = [
  32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9,
  8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16, 17,
  16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25,
  24, 25, 26, 27, 28, 29, 28, 29, 30, 31, 32, 1
];

const PBOX = [
  16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10,
  2, 8, 24, 14, 32, 27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25
];

const SBOX = [
  [
    [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
    [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
    [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
    [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
  ],
  [
    [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
    [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
    [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
    [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
  ],
  [
    [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
    [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
    [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
    [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
  ],
  [
    [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
    [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
    [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
    [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
  ],
  [
    [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
    [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
    [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
    [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
  ],
  [
    [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
    [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
    [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
    [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
  ],
  [
    [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
    [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
    [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
    [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
  ],
  [
    [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
    [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
    [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
    [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
  ]
];

// --- Helpers ---

const hexToBinary = (hex: string): string => {
  return hex.split('').map(c => parseInt(c, 16).toString(2).padStart(4, '0')).join('');
};

const binaryToHex = (bin: string): string => {
  let hex = "";
  for (let i = 0; i < bin.length; i += 4) {
    hex += parseInt(bin.substring(i, i + 4), 2).toString(16).toUpperCase();
  }
  return hex;
};

const performXOR = (hex1: string, hex2: string): string => {
  const b1 = hexToBinary(hex1);
  const b2 = hexToBinary(hex2);
  let res = "";
  for (let i = 0; i < b1.length; i++) {
    res += (b1[i] === b2[i] ? '0' : '1');
  }
  return binaryToHex(res);
};

const permutation = (box: number[], hex: string): string => {
  const binary = hexToBinary(hex);
  let res = "";
  for (let i = 0; i < box.length; i++) {
    res += binary.charAt(box[i] - 1);
  }
  return binaryToHex(res);
};

const leftCircularShift = (input: string, round: number): string => {
  if (round === 1 || round === 2 || round === 9 || round === 16) {
    return input.substring(1) + input.charAt(0);
  } else {
    return input.substring(2) + input.substring(0, 2);
  }
};

/**
 * Generates the full breakdown for DES visualization.
 */
export function getDESSteps(hexText: string, hexKey: string, decrypt: boolean): DESBreakdown {
    if (!/^[0-9A-Fa-f]{16}$/.test(hexKey)) {
    throw new Error("DES key must be exactly 16 hexadecimal characters.");
  }
  if (!/^[0-9A-Fa-f]{16}$/.test(hexText)) {
    throw new Error("DES input text must be exactly 16 hexadecimal characters (one 64-bit block).");
  }

  const subkeySteps: SubkeyStep[] = [];
  const subkeys: string[] = [];

  // Key Schedule
  const pc1Key = permutation(PC1, hexKey);
  let binaryKey = hexToBinary(pc1Key);

  for (let i = 1; i <= 16; i++) {
    const leftHalf = binaryKey.substring(0, 28);
    const rightHalf = binaryKey.substring(28, 56);
    const shiftedLeft = leftCircularShift(leftHalf, i);
    const shiftedRight = leftCircularShift(rightHalf, i);
    binaryKey = shiftedLeft + shiftedRight;
    const subkey = permutation(PC2, binaryToHex(binaryKey));
    
    subkeySteps.push({
      round: i,
      leftHalf,
      rightHalf,
      shiftedLeft,
      shiftedRight,
      subkey
    });
    subkeys.push(subkey);
  }

  const activeSubkeys = decrypt ? [...subkeys].reverse() : subkeys;

  // Data Processing
  let text = permutation(IP, hexText);
  const initialPermutation = text;
  
  const rounds: DESRoundBreakdown[] = [];
  
  for (let i = 0; i < 16; i++) {
    const L = text.substring(0, 8);
    const R = text.substring(8, 16);
    const key = activeSubkeys[i];
    
    // Step 1: Expansion D-box
    const expandedR = permutation(EXP_D, R);
    
    // Step 2: XOR with round key
    const xoredWithKey = performXOR(expandedR, key);
    
    // Step 3: S-boxes
    const binaryXored = hexToBinary(xoredWithKey);
    let sboxBinaryOutput = "";
    for (let j = 0; j < 8; j++) {
      const sboxInput = binaryXored.substring(j * 6, (j + 1) * 6);
      const row = parseInt(sboxInput.charAt(0) + sboxInput.charAt(5), 2);
      const col = parseInt(sboxInput.substring(1, 5), 2);
      sboxBinaryOutput += SBOX[j][row][col].toString(2).padStart(4, '0');
    }
    const sboxOutput = binaryToHex(sboxBinaryOutput);
    
    // Step 4: P-box permutation
    const fResult = permutation(PBOX, sboxOutput);
    
    // Step 5: XOR with old Left side
    const xorWithOldLeft = performXOR(L, fResult);
    
    // Step 6: Swapping (except last round)
    const isLastRound = i === 15;
    let nextL, nextR;
    if (isLastRound) {
      nextL = xorWithOldLeft;
      nextR = R;
    } else {
      nextL = R;
      nextR = xorWithOldLeft;
    }

    rounds.push({
      round: i + 1,
      L,
      R,
      key,
      expandedR,
      xoredWithKey,
      sboxOutput,
      fResult,
      xorWithOldLeft,
      nextL,
      nextR,
      swapped: !isLastRound
    });

    text = nextL + nextR;
  }

  const finalPermutation = permutation(IP1, text);

  return {
    pc1Key,
    pc1KeyBinary: hexToBinary(pc1Key),
    subkeySteps,
    subkeys,
    initialPermutation,
    rounds,
    finalPermutation
  };
}
