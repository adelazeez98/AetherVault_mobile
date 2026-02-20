'use client';

import { 
  additiveCipher, 
  multiplicativeCipher, 
  affineCipher, 
  vigenereCipher, 
  autokeyCipher, 
  playfairCipher, 
  hillCipher 
} from '@/lib/ciphers/core';
import { adfgvxCipher } from '@/lib/ciphers/adfgvx';
import { aes128Cipher, desCipher } from '@/lib/ciphers/modern';

export type CipherResponse = {
  success: boolean;
  message: string;
  output: string;
  metadata?: Record<string, any>;
};

/**
 * Processes cipher requests entirely on the client side.
 * This ensures high performance and maximum privacy.
 */
export async function processCipher(formData: FormData): Promise<CipherResponse> {
  const type = formData.get('type') as string;
  const text = formData.get('text') as string;
  const action = formData.get('action') as string;

  try {
    let result = '';
    let metadata: Record<string, any> = {};
    const decrypt = action === 'decrypt';

    switch (type) {
      case 'additive': {
        const key = parseInt(formData.get('key') as string);
        result = additiveCipher(text, key, decrypt);
        break;
      }
      case 'multiplicative': {
        const key = parseInt(formData.get('key') as string);
        result = multiplicativeCipher(text, key, decrypt);
        break;
      }
      case 'affine': {
        const a = parseInt(formData.get('keyA') as string);
        const b = parseInt(formData.get('keyB') as string);
        result = affineCipher(text, a, b, decrypt);
        break;
      }
      case 'vigenere': {
        const key = formData.get('key') as string;
        result = vigenereCipher(text, key, decrypt);
        break;
      }
      case 'autokey': {
        const key = formData.get('key') as string;
        result = autokeyCipher(text, key, decrypt);
        break;
      }
      case 'playfair': {
        const key = formData.get('key') as string;
        result = playfairCipher(text, key, decrypt);
        break;
      }
      case 'hill': {
        const size = parseInt(formData.get('matrixSize') as string || '2');
        const mode = (formData.get('hillMode') as 'standard' | 'book') || 'standard';
        
        const matrix: number[][] = [];
        for (let i = 0; i < size; i++) {
          const row: number[] = [];
          for (let j = 0; j < size; j++) {
            const val = formData.get(`m-${i}-${j}`) as string;
            if (val === null || val === '') throw new Error(`Matrix element at [${i+1},${j+1}] is missing.`);
            row.push(parseInt(val));
          }
          matrix.push(row);
        }
        
        result = hillCipher(text, matrix, mode, decrypt);
        break;
      }
      case 'adfgvx': {
        const square = formData.get('square') as string;
        const transKey = formData.get('transKey') as string;
        const usePadding = action === 'encrypt-with-padding';
        
        const { output, fullSquare } = adfgvxCipher(text, square, transKey, decrypt, usePadding);
        result = output;
        metadata.fullSquare = fullSquare;
        break;
      }
      case 'aes128': {
        const key = formData.get('key') as string;
        result = aes128Cipher(text, key, decrypt);
        break;
      }
       case 'des': {
        const key = formData.get('key') as string;
        result = desCipher(text, key, decrypt);
        break;
      }
      default:
        throw new Error("Unsupported cipher type.");
    }

    return { 
      success: true, 
      message: "Operation successful", 
      output: result,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined
    };
  } catch (error: any) {
    return { success: false, message: error.message || "An error occurred", output: "" };
  }
}
