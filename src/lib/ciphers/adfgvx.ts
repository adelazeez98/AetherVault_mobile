
import { mod } from './core';

export const adfgvxCipher = (
  text: string,
  square: string,
  transpositionKey: string,
  decrypt = false,
  paddingChar?: string
): { output: string; fullSquare: string } => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let cleanInput = square.toUpperCase().replace(/[^A-Z0-9]/g, '');
  let matrixArr = Array.from(new Set(cleanInput.split('')));
  
  for (const char of alphabet) {
    if (!matrixArr.includes(char)) {
      matrixArr.push(char);
    }
    if (matrixArr.length === 36) break;
  }
  
  const matrix = matrixArr;
  const fullSquare = matrix.join('');
  const headers = "ADFGVX";
  
  const cleanTransKey = transpositionKey.toUpperCase().replace(/[^A-Z]/g, '');
  if (!cleanTransKey) throw new Error("Transposition key is required for ADFGVX.");
  
  const sortedKey = cleanTransKey.split('').map((c, i) => ({ c, i })).sort((a, b) => {
    if (a.c < b.c) return -1;
    if (a.c > b.c) return 1;
    return a.i - b.i; // Stable sort
  });

  if (!decrypt) {
    // This already strips non-alphanumeric characters for encryption
    const cleanText = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let fractionated = "";
    for (const char of cleanText) {
      const idx = matrix.indexOf(char);
      if (idx === -1) continue;
      fractionated += headers[Math.floor(idx / 6)] + headers[idx % 6];
    }

    const cols = cleanTransKey.length;
    const rows = Math.ceil(fractionated.length / cols);
    const grid: string[][] = Array.from({ length: rows }, () => Array(cols));
    
    let charIdx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (charIdx < fractionated.length) {
          grid[r][c] = fractionated[charIdx++];
        } else {
          grid[r][c] = paddingChar || '';
        }
      }
    }

    let result = "";
    for (const { i } of sortedKey) {
      for (let r = 0; r < rows; r++) {
        result += grid[r][i];
      }
    }
    return { output: result, fullSquare };

  } else { // DECRYPTION
    if (/[^ADFGVX]/i.test(text)) {
        throw new Error("Decryption text must contain only ADFGVX characters.");
    }
    const cleanCipher = text.toUpperCase();
    
    const cols = cleanTransKey.length;
    const rows = Math.ceil(cleanCipher.length / cols);
    const longCols = cleanCipher.length % cols === 0 ? 0 : cleanCipher.length % cols;
    
    const colData: { [originalIndex: number]: string } = {};
    let cursor = 0;
    sortedKey.forEach((key, sortedIdx) => {
        const colLength = sortedIdx < longCols ? rows : rows - 1;
        if(longCols === 0) { // If it divides evenly
            colData[key.i] = cleanCipher.substring(cursor, cursor + rows);
            cursor += rows;
        } else {
            colData[key.i] = cleanCipher.substring(cursor, cursor + colLength);
            cursor += colLength;
        }
    });

    let fractionated = "";
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
          if (colData[c] && r < colData[c].length) {
              fractionated += colData[c][r];
          }
      }
    }

    let result = "";
    for (let i = 0; i < fractionated.length; i += 2) {
      if (i + 1 >= fractionated.length) break;
      const r = headers.indexOf(fractionated[i]);
      const c = headers.indexOf(fractionated[i + 1]);
      if (r !== -1 && c !== -1) {
        result += matrix[r * 6 + c];
      }
    }
    return { output: result, fullSquare };
  }
};
