import CryptoJS from 'crypto-js';

/**
 * AES-128 Encryption/Decryption using crypto-js
 * Expects:
 * - 32-character hex key (128 bits)
 * - 32-character hex text (128 bit block)
 */
export const aes128Cipher = (text: string, key: string, decrypt = false): string => {
  if (!/^[0-9A-Fa-f]{32}$/.test(key)) {
    throw new Error("AES-128 key must be exactly 32 hexadecimal characters.");
  }
  if (!/^[0-9A-Fa-f]{32}$/.test(text)) {
    throw new Error("AES-128 input text must be exactly 32 hexadecimal characters (one 128-bit block).");
  }

  const keyHex = CryptoJS.enc.Hex.parse(key);
  const textHex = CryptoJS.enc.Hex.parse(text);
  const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000'); // Zero IV

  if (decrypt) {
    try {
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: textHex } as CryptoJS.lib.CipherParams,
        keyHex,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.NoPadding
        }
      );
      const result = decrypted.toString(CryptoJS.enc.Hex);
      if (!result) throw new Error("Empty result");
      return result.toUpperCase();
    } catch (e) {
      throw new Error("Decryption failed. Ensure input is valid hex block.");
    }
  } else {
    const encrypted = CryptoJS.AES.encrypt(textHex, keyHex, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.NoPadding
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase();
  }
};

/**
 * DES Encryption/Decryption using crypto-js
 * Expects:
 * - 16-character hex key (64 bits)
 * - 16-character hex text (64 bit block)
 */
export const desCipher = (text: string, key: string, decrypt = false): string => {
  if (!/^[0-9A-Fa-f]{16}$/.test(key)) {
    throw new Error("DES key must be exactly 16 hexadecimal characters.");
  }
  if (!/^[0-9A-Fa-f]{16}$/.test(text)) {
    throw new Error("DES input text must be exactly 16 hexadecimal characters (one 64-bit block).");
  }

  const keyHex = CryptoJS.enc.Hex.parse(key);
  const textHex = CryptoJS.enc.Hex.parse(text);
  const iv = CryptoJS.enc.Hex.parse('0000000000000000'); // Zero IV

  if (decrypt) {
    try {
      const decrypted = CryptoJS.DES.decrypt(
        { ciphertext: textHex } as CryptoJS.lib.CipherParams,
        keyHex,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.NoPadding
        }
      );
      const result = decrypted.toString(CryptoJS.enc.Hex);
      if (!result) throw new Error("Empty result");
      return result.toUpperCase();
    } catch (e) {
      throw new Error("Decryption failed. Ensure input is valid hex block.");
    }
  } else {
    const encrypted = CryptoJS.DES.encrypt(textHex, keyHex, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.NoPadding
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase();
  }
};
