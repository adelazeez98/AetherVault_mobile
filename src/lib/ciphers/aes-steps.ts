/**
 * AES-128 Step-by-Step Logic
 * Captures intermediate states for visualization based on standard AES-128 specs.
 */

export interface AESEncryptionRoundBreakdown {
  round: number;
  inputState: string[][];
  afterSubBytes: string[][];
  afterShiftRows: string[][];
  afterMixColumns?: string[][]; // Not in Round 10
  afterAddRoundKey: string[][];
  roundKey: string;
}

export interface AESDecryptionRoundBreakdown {
  round: number;
  inputState: string[][];
  afterInvShiftRows: string[][];
  afterInvSubBytes: string[][];
  afterAddRoundKey: string[][];
  afterInvMixColumns?: string[][]; // Not for final round
  roundKey: string;
}

export interface AESWordStep {
  index: number;
  prevWord: string; // W(i-1)
  wordMinus4: string; // W(i-4)
  rotated?: string;
  substituted?: string;
  rcon?: string;
  xorWithRcon?: string;
  result: string;
  isSpecial: boolean;
}

export interface AESBreakdown {
  initialState: string[][];
  wordSteps: AESWordStep[];
  subKeys: string[];
  encryptionRounds?: AESEncryptionRoundBreakdown[];
  decryptionRounds?: AESDecryptionRoundBreakdown[];
  finalOutput: string;
  action: 'encrypt' | 'decrypt';
}

// --- Tables ---

const SBOX = [
  "63", "7C", "77", "7B", "F2", "6B", "6F", "C5", "30", "01", "67", "2B", "FE", "D7", "AB", "76",
  "CA", "82", "C9", "7D", "FA", "59", "47", "F0", "AD", "D4", "A2", "AF", "9C", "A4", "72", "C0",
  "B7", "FD", "93", "26", "36", "3F", "F7", "CC", "34", "A5", "E5", "F1", "71", "D8", "31", "15",
  "04", "C7", "23", "C3", "18", "96", "05", "9A", "07", "12", "80", "E2", "EB", "27", "B2", "75",
  "09", "83", "2C", "1A", "1B", "6E", "5A", "A0", "52", "3B", "D6", "B3", "29", "E3", "2F", "84",
  "53", "D1", "00", "ED", "20", "FC", "B1", "5B", "6A", "CB", "BE", "39", "4A", "4C", "58", "CF",
  "D0", "EF", "AA", "FB", "43", "4D", "33", "85", "45", "F9", "02", "7F", "50", "3C", "9F", "A8",
  "51", "A3", "40", "8F", "92", "9D", "38", "F5", "BC", "B6", "DA", "21", "10", "FF", "F3", "D2",
  "CD", "0C", "13", "EC", "5F", "97", "44", "17", "C4", "A7", "7E", "3D", "64", "5D", "19", "73",
  "60", "81", "4F", "DC", "22", "2A", "90", "88", "46", "EE", "B8", "14", "DE", "5E", "0B", "DB",
  "E0", "32", "3A", "0A", "49", "06", "24", "5C", "C2", "D3", "AC", "62", "91", "95", "E4", "79",
  "E7", "C8", "37", "6D", "8D", "D5", "4E", "A9", "6C", "56", "F4", "EA", "65", "7A", "AE", "08",
  "BA", "78", "25", "2E", "1C", "A6", "B4", "C6", "E8", "DD", "74", "1F", "4B", "BD", "8B", "8A",
  "70", "3E", "B5", "66", "48", "03", "F6", "0E", "61", "35", "57", "B9", "86", "C1", "1D", "9E",
  "E1", "F8", "98", "11", "69", "D9", "8E", "94", "9B", "1E", "87", "E9", "CE", "55", "28", "DF",
  "8C", "A1", "89", "0D", "BF", "E6", "42", "68", "41", "99", "2D", "0F", "B0", "54", "BB", "16"
];

const INV_SBOX = [
  "52", "09", "6A", "D5", "30", "36", "A5", "38", "BF", "40", "A3", "9E", "81", "F3", "D7", "FB",
  "7C", "E3", "39", "82", "9B", "2F", "FF", "87", "34", "8E", "43", "44", "C4", "DE", "E9", "CB",
  "54", "7B", "94", "32", "A6", "C2", "23", "3D", "EE", "4C", "95", "0B", "42", "FA", "C3", "4E",
  "08", "2E", "A1", "66", "28", "D9", "24", "B2", "76", "5B", "A2", "49", "6D", "8B", "D1", "25",
  "72", "F8", "F6", "64", "86", "68", "98", "16", "D4", "A4", "5C", "CC", "5D", "65", "B6", "92",
  "6C", "70", "48", "50", "FD", "ED", "B9", "DA", "5E", "15", "46", "57", "A7", "8D", "9D", "84",
  "90", "D8", "AB", "00", "8C", "BC", "D3", "0A", "F7", "E4", "58", "05", "B8", "B3", "45", "06",
  "D0", "2C", "1E", "8F", "CA", "3F", "0F", "02", "C1", "AF", "BD", "03", "01", "13", "8A", "6B",
  "3A", "91", "11", "41", "4F", "67", "DC", "EA", "97", "F2", "CF", "CE", "F0", "B4", "E6", "73",
  "96", "AC", "74", "22", "E7", "AD", "35", "85", "E2", "F9", "37", "E8", "1C", "75", "DF", "6E",
  "47", "F1", "1A", "71", "1D", "29", "C5", "89", "6F", "B7", "62", "0E", "AA", "18", "BE", "1B",
  "FC", "56", "3E", "4B", "C6", "D2", "79", "20", "9A", "DB", "C0", "FE", "78", "CD", "5A", "F4",
  "1F", "DD", "A8", "33", "88", "07", "C7", "31", "B1", "12", "10", "59", "27", "80", "EC", "5F",
  "60", "51", "7F", "A9", "19", "B5", "4A", "0D", "2D", "E5", "7A", "9F", "93", "C9", "9C", "EF",
  "A0", "E0", "3B", "4D", "AE", "2A", "F5", "B0", "C8", "EB", "BB", "3C", "83", "53", "99", "61",
  "17", "2B", "04", "7E", "BA", "77", "D6", "26", "E1", "69", "14", "63", "55", "21", "0C", "7D"
];


const RCON = [
  "01000000", "02000000", "04000000", "08000000", "10000000",
  "20000000", "40000000", "80000000", "1B000000", "36000000"
];

// --- Helpers ---

const performXOR = (h1: string, h2: string): string => {
  let res = "";
  for (let i = 0; i < h1.length; i++) {
    const v1 = parseInt(h1[i], 16);
    const v2 = parseInt(h2[i], 16);
    res += (v1 ^ v2).toString(16).toUpperCase();
  }
  return res;
};

const gMul = (a: number, b: number): number => {
  let p = 0;
  for (let counter = 0; counter < 8; counter++) {
    if ((b & 1) !== 0) p ^= a;
    const hiBitSet = (a & 0x80) !== 0;
    a <<= 1;
    if (hiBitSet) a ^= 0x1B;
    b >>= 1;
  }
  return p & 0xFF;
};

const blockToState = (hex: string): string[][] => {
  const state: string[][] = [[], [], [], []];
  for (let i = 0; i < 16; i++) {
    state[i % 4][Math.floor(i / 4)] = hex.substring(i * 2, (i * 2) + 2).toUpperCase();
  }
  return state;
};

const stateToBlock = (state: string[][]): string => {
  let res = "";
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      res += state[r][c];
    }
  }
  return res;
};

// --- Core AES Steps ---

const subBytes = (state: string[][]): string[][] => {
  return state.map(row => row.map(cell => SBOX[parseInt(cell, 16)]));
};

const shiftRows = (state: string[][]): string[][] => {
  const newState = state.map(r => [...r]);
  for (let i = 1; i < 4; i++) {
    for (let j = 0; j < i; j++) {
      const temp = newState[i].shift();
      newState[i].push(temp!);
    }
  }
  return newState;
};

const mixColumns = (state: string[][]): string[][] => {
  const newState: string[][] = [[], [], [], []];
  for (let c = 0; c < 4; c++) {
    const s0 = parseInt(state[0][c], 16);
    const s1 = parseInt(state[1][c], 16);
    const s2 = parseInt(state[2][c], 16);
    const s3 = parseInt(state[3][c], 16);

    newState[0][c] = (gMul(0x02, s0) ^ gMul(0x03, s1) ^ s2 ^ s3).toString(16).padStart(2, '0').toUpperCase();
    newState[1][c] = (s0 ^ gMul(0x02, s1) ^ gMul(0x03, s2) ^ s3).toString(16).padStart(2, '0').toUpperCase();
    newState[2][c] = (s0 ^ s1 ^ gMul(0x02, s2) ^ gMul(0x03, s3)).toString(16).padStart(2, '0').toUpperCase();
    newState[3][c] = (gMul(0x03, s0) ^ s1 ^ s2 ^ gMul(0x02, s3)).toString(16).padStart(2, '0').toUpperCase();
  }
  return newState;
};

const addRoundKey = (state: string[][], key: string): string[][] => {
  const keyState = blockToState(key);
  const newState: string[][] = [[], [], [], []];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      newState[r][c] = (parseInt(state[r][c], 16) ^ parseInt(keyState[r][c], 16)).toString(16).padStart(2, '0').toUpperCase();
    }
  }
  return newState;
};

// --- Inverse AES Steps ---

const invSubBytes = (state: string[][]): string[][] => {
  return state.map(row => row.map(cell => INV_SBOX[parseInt(cell, 16)]));
};

const invShiftRows = (state: string[][]): string[][] => {
  const newState = state.map(r => [...r]);
  for (let i = 1; i < 4; i++) {
    for (let j = 0; j < i; j++) {
      const temp = newState[i].pop();
      newState[i].unshift(temp!);
    }
  }
  return newState;
};

const invMixColumns = (state: string[][]): string[][] => {
  const newState: string[][] = [[], [], [], []];
  for (let c = 0; c < 4; c++) {
    const s0 = parseInt(state[0][c], 16);
    const s1 = parseInt(state[1][c], 16);
    const s2 = parseInt(state[2][c], 16);
    const s3 = parseInt(state[3][c], 16);
    newState[0][c] = (gMul(0x0e, s0) ^ gMul(0x0b, s1) ^ gMul(0x0d, s2) ^ gMul(0x09, s3)).toString(16).padStart(2, '0').toUpperCase();
    newState[1][c] = (gMul(0x09, s0) ^ gMul(0x0e, s1) ^ gMul(0x0b, s2) ^ gMul(0x0d, s3)).toString(16).padStart(2, '0').toUpperCase();
    newState[2][c] = (gMul(0x0d, s0) ^ gMul(0x09, s1) ^ gMul(0x0e, s2) ^ gMul(0x0b, s3)).toString(16).padStart(2, '0').toUpperCase();
    newState[3][c] = (gMul(0x0b, s0) ^ gMul(0x0d, s1) ^ gMul(0x09, s2) ^ gMul(0x0e, s3)).toString(16).padStart(2, '0').toUpperCase();
  }
  return newState;
};

export function getAESSteps(hexText: string, hexKey: string, decrypt = false): AESBreakdown {
  if (!/^[0-9A-Fa-f]{32}$/.test(hexKey)) {
    throw new Error("AES-128 key must be exactly 32 hexadecimal characters.");
  }
  if (!/^[0-9A-Fa-f]{32}$/.test(hexText)) {
    throw new Error("AES-128 input text must be exactly 32 hexadecimal characters (one 128-bit block).");
  }

  // --- Key Expansion (same for both encrypt and decrypt) ---
  const wordSteps: AESWordStep[] = [];
  const words: string[] = [];

  for (let i = 0; i < 4; i++) {
    words[i] = hexKey.substring(i * 8, (i + 1) * 8).toUpperCase();
  }

  for (let i = 4; i < 44; i++) {
    const prevWord = words[i - 1];
    const wordMinus4 = words[i - 4];
    let step: AESWordStep = { index: i, prevWord, wordMinus4, result: "", isSpecial: false };

    if (i % 4 === 0) {
      step.isSpecial = true;
      const rotated = prevWord.substring(2) + prevWord.substring(0, 2);
      let substituted = "";
      for (let k = 0; k < 4; k++) {
        substituted += SBOX[parseInt(rotated.substring(k * 2, (k + 1) * 2), 16)];
      }
      const rcon = RCON[(i / 4) - 1];
      const xorWithRcon = performXOR(substituted, rcon);
      const result = performXOR(xorWithRcon, wordMinus4);
      
      step = { ...step, rotated, substituted, rcon, xorWithRcon, result };
      words[i] = result;
    } else {
      words[i] = performXOR(prevWord, wordMinus4);
      step.result = words[i];
    }
    wordSteps.push(step);
  }

  const subKeys: string[] = [];
  for (let i = 0; i < 44; i += 4) {
    subKeys.push(words[i] + words[i + 1] + words[i + 2] + words[i + 3]);
  }

  const initialState = blockToState(hexText);

  // --- Decryption ---
  if (decrypt) {
    const decryptionRounds: AESDecryptionRoundBreakdown[] = [];
    let currentState = blockToState(hexText);

    // Initial AddRoundKey
    currentState = addRoundKey(currentState, subKeys[10]);
    
    // Main 9 rounds (decryption rounds 1-9)
    for (let i = 9; i >= 1; i--) {
      const inputState = currentState.map(r => [...r]);
      const afterInvShiftRows = invShiftRows(inputState);
      const afterInvSubBytes = invSubBytes(afterInvShiftRows);
      const afterAddRoundKey = addRoundKey(afterInvSubBytes, subKeys[i]);
      const afterInvMixColumns = invMixColumns(afterAddRoundKey);
      currentState = afterInvMixColumns;
        
      decryptionRounds.push({
        round: 10 - i,
        inputState,
        afterInvShiftRows,
        afterInvSubBytes,
        afterAddRoundKey,
        afterInvMixColumns,
        roundKey: subKeys[i],
      });
    }
    
    // Final round (decryption round 10)
    const finalRoundInput = currentState.map(r => [...r]);
    const finalAfterInvShiftRows = invShiftRows(finalRoundInput);
    const finalAfterInvSubBytes = invSubBytes(finalAfterInvShiftRows);
    const finalAfterAddRoundKey = addRoundKey(finalAfterInvSubBytes, subKeys[0]);
    currentState = finalAfterAddRoundKey;

    decryptionRounds.push({
      round: 10,
      inputState: finalRoundInput,
      afterInvShiftRows: finalAfterInvShiftRows,
      afterInvSubBytes: finalAfterInvSubBytes,
      afterAddRoundKey: finalAfterAddRoundKey,
      roundKey: subKeys[0],
    });
    
    return {
      initialState,
      wordSteps,
      subKeys,
      decryptionRounds,
      finalOutput: stateToBlock(currentState),
      action: 'decrypt',
    };
  }

  // --- Encryption ---
  const encryptionRounds: AESEncryptionRoundBreakdown[] = [];
  let currentState = addRoundKey(initialState, subKeys[0]);
  
  for (let i = 1; i <= 10; i++) {
    const inputState = currentState.map(r => [...r]);
    const afterSubBytes = subBytes(inputState);
    const afterShiftRows = shiftRows(afterSubBytes);
    let afterMixColumns: string[][] | undefined;
    
    if (i < 10) {
      afterMixColumns = mixColumns(afterShiftRows);
      currentState = addRoundKey(afterMixColumns, subKeys[i]);
    } else {
      currentState = addRoundKey(afterShiftRows, subKeys[i]);
    }

    encryptionRounds.push({
      round: i,
      inputState,
      afterSubBytes,
      afterShiftRows,
      afterMixColumns,
      afterAddRoundKey: currentState.map(r => [...r]),
      roundKey: subKeys[i]
    });
  }

  return {
    initialState,
    wordSteps,
    subKeys,
    encryptionRounds,
    finalOutput: stateToBlock(currentState),
    action: 'encrypt'
  };
}
