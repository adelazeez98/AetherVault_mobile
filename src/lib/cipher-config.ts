export enum Algorithm {
    Caesar = 'additive',
    Multiplicative = 'multiplicative',
    Affine = 'affine',
    Vigenere = 'vigenere',
    Autokey = 'autokey',
    Playfair = 'playfair',
    Hill = 'hill',
    ADFGVX = 'adfgvx',
    AES = 'aes128',
    DES = 'des',
  }
  
  export const ALGORITHM_CONFIG: Record<Algorithm, { name: string; description: string; params?: any }> = {
    [Algorithm.Caesar]: {
      name: 'Additive',
      description: 'A simple substitution cipher that shifts letters by a fixed number.',
      params: {
        key: { label: 'Key (Shift)', type: 'number', placeholder: 'e.g., 3', fullWidth: true },
      },
    },
    [Algorithm.Multiplicative]: {
      name: 'Multiplicative',
      description: 'A substitution cipher using multiplication, where the key must be coprime to 26.',
      params: {
        key: { label: 'Key (must be coprime to 26)', type: 'number', placeholder: 'e.g., 7', fullWidth: true },
      },
    },
    [Algorithm.Affine]: {
      name: 'Affine',
      description: 'A combination of the additive and multiplicative ciphers.',
      params: {
        keyA: { label: 'Key A (must be coprime to 26)', type: 'number', placeholder: 'e.g., 5' },
        keyB: { label: 'Key B (Shift)', type: 'number', placeholder: 'e.g., 8' },
      },
    },
    [Algorithm.Vigenere]: {
      name: 'Vigenère',
      description: 'A polyalphabetic substitution cipher that uses a keyword to shift letters.',
      params: {
        key: { label: 'Key', type: 'text', placeholder: 'e.g., "KEY"', fullWidth: true },
      },
    },
    [Algorithm.Autokey]: {
        name: 'Autokey',
        description: 'Similar to Vigenère, but the key is extended using the plaintext itself.',
        params: {
          key: { label: 'Key', type: 'text', placeholder: 'e.g., "KEY"', fullWidth: true },
        },
      },
    [Algorithm.Playfair]: {
      name: 'Playfair',
      description: 'A digraph substitution cipher that encrypts pairs of letters.',
      params: {
        key: { label: 'Key', type: 'text', placeholder: 'e.g., "PLAYFAIR"', fullWidth: true },
      },
    },
    [Algorithm.Hill]: {
        name: 'Hill Cipher',
        description: 'A polygraphic substitution cipher based on linear algebra, using an invertible matrix as the key.',
    },
    [Algorithm.ADFGVX]: {
        name: 'ADFGVX',
        description: 'A fractionating transposition cipher used by the German Army in World War I.',
        params: {
            square: { label: 'Polybius Square Key', type: 'text', placeholder: 'e.g., "phqgmeaynofdxkrcvszwbutil"', fullWidth: true },
            transKey: { label: 'Transposition Key', type: 'text', placeholder: 'e.g., "GERMAN"', fullWidth: true },
        },
    },
    [Algorithm.AES]: {
      name: 'AES-128',
      description: 'Encrypt/decrypt a 128-bit block using AES. A visualizer is available after processing.',
      params: {
        key: { label: 'Key (32 hex chars)', type: 'text', placeholder: '32-character hex key', fullWidth: true },
      },
    },
    [Algorithm.DES]: {
        name: 'DES',
        description: 'Encrypt/decrypt a 64-bit block using DES. A visualizer is available after processing.',
        params: {
          key: { label: 'Key (16 hex chars)', type: 'text', placeholder: '16-character hex key', fullWidth: true },
        },
      },
  };
  