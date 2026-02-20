
export interface DesBox {
  id: string;
  title: string;
  description: string;
  java: string;
  python: string;
  cpp: string;
  examples: {
    java: string;
    python: string;
    cpp: string;
  };
}

const IP_DATA = [58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46, 38, 30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8, 57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27, 19, 11, 3, 61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7];
const IP1_DATA = [40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31, 38, 6, 46, 14, 54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29, 36, 4, 44, 12, 52, 20, 60, 28, 35, 3, 43, 11, 51, 19, 59, 27, 34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9, 49, 17, 57, 25];
const PC1_DATA = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4];
const PC2_DATA = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32];
const EXP_D_DATA = [32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9, 8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16, 17, 16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25, 24, 25, 26, 27, 28, 29, 28, 29, 30, 31, 32, 1];
const PBOX_DATA = [16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10, 2, 8, 24, 14, 32, 27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25];
const SBOX_DATA = [
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

const format1D = (data: number[], name: string) => {
    const perLine = 11;
    const javaRows = [];
    const pythonRows = [];
    const cppRows = [];
    for (let i = 0; i < data.length; i += perLine) {
      const slice = data.slice(i, i + perLine);
      const rowContent = slice.map(v => `${v}`).join(", ");
      javaRows.push(`    ${rowContent}`);
      pythonRows.push(`    ${rowContent}`);
      cppRows.push(`    ${rowContent}`);
    }
    const java = `private static final int[] ${name} = {\n${javaRows.join(",\n")}\n};`;
    const python = `${name} = [\n${pythonRows.join(",\n")}\n]`;
    const cpp = `const std::vector<int> ${name} = {\n${cppRows.join(",\n")}\n};`;
    return { java, python, cpp };
};

const format3D = (data: number[][][], name: string) => {
    const javaBoxes = data.map(box => 
        `  {\n${box.map(row => `    {${row.join(', ')}}`).join(',\n')}\n  }`
    );
    const pythonBoxes = data.map(box => 
        `  [\n${box.map(row => `    [${row.join(', ')}]`).join(',\n')}\n  ]`
    );
    const cppBoxes = data.map(box => 
        `  {\n${box.map(row => `    {${row.join(', ')}}`).join(',\n')}\n  }`
    );

    const java = `private static final int[][][] ${name} = {\n${javaBoxes.join(',\n')}\n};`;
    const python = `${name} = [\n${pythonBoxes.join(',\n')}\n]`;
    const cpp = `const std::vector<std::vector<std::vector<int>>> ${name} = {\n${cppBoxes.join(',\n')}\n};`;

    return { java, python, cpp };
};

const permutationExample = (name: string) => ({
    java: `// Example: Permute a 64-bit block using the ${name} table.
String hexBlock = "0123456789ABCDEF"; 
// Helper function to convert hex string to a 64-char binary string
String binaryBlock = hexToBinary(hexBlock); 
StringBuilder permutedBinary = new StringBuilder();

for (int index : ${name}) {
    permutedBinary.append(binaryBlock.charAt(index - 1));
}
// Helper function to convert binary string back to hex
String permutedHex = binaryToHex(permutedBinary.toString());`,
    python: `# Example: Permute a 64-bit block using the ${name} table.
hex_block = "0123456789ABCDEF"
binary_block = bin(int(hex_block, 16))[2:].zfill(64)
permuted_binary = "".join([binary_block[index - 1] for index in ${name}])
permuted_hex = hex(int(permuted_binary, 2))
`,
    cpp: `// Example: Permute a 64-bit block using the ${name} table.
#include <string>
#include <vector>
#include <bitset>
#include <sstream>

// std::string hexToBinary(const std::string& hex);
// std::string binaryToHex(const std::string& bin);

std::string hex_block = "0123456789ABCDEF";
std::string binary_block = hexToBinary(hex_block);
std::string permuted_binary;
for (int index : ${name}) {
    permuted_binary += binary_block[index - 1];
}
std::string permuted_hex = binaryToHex(permuted_binary);
`
});

const sboxExample = {
    java: `// Example: Use S-Box 1 to substitute a 6-bit input.
String sixBitInput = "101101"; // e.g., from part of the expanded/xored data
int sboxIndex = 0; // S-Box 1

// First and last bits determine the row
int row = Integer.parseInt("" + sixBitInput.charAt(0) + sixBitInput.charAt(5), 2); // "11" -> 3
// Middle four bits determine the column
int col = Integer.parseInt(sixBitInput.substring(1, 5), 2); // "0110" -> 6

int result = SBOX[sboxIndex][row][col]; // SBOX[0][3][6] -> 1
// String fourBitOutput = Integer.toBinaryString(result).padStart(4, '0'); // "0001"`,
    python: `# Example: Use S-Box 1 to substitute a 6-bit input.
six_bit_input = "101101" # e.g., from part of the expanded/xored data
sbox_index = 0 # S-Box 1

# First and last bits determine the row
row = int(six_bit_input[0] + six_bit_input[5], 2) # "11" -> 3
# Middle four bits determine the column
col = int(six_bit_input[1:5], 2) # "0110" -> 6

result = SBOX[sbox_index][row][col] # SBOX[0][3][6] -> 1
# four_bit_output = bin(result)[2:].zfill(4) -> "0001"`,
    cpp: `// Example: Use S-Box 1 to substitute a 6-bit input.
#include <string>
#include <vector>
#include <bitset>

std::string six_bit_input = "101101";
int sbox_index = 0; // S-Box 1

// First and last bits for the row
std::bitset<2> row_bits(std::string() + six_bit_input[0] + six_bit_input[5]);
int row = row_bits.to_ulong(); // 3

// Middle four bits for the column
std::bitset<4> col_bits(six_bit_input.substr(1, 4));
int col = col_bits.to_ulong(); // 6

int result = SBOX[sbox_index][row][col]; // SBOX[0][3][6] -> 1
// std::cout << std::bitset<4>(result); -> "0001"`,
};


export const DES_BOXES: DesBox[] = [
    { id: 'ip', title: 'Initial Permutation (IP)', description: 'The first step of DES, which rearranges the 64 bits of the input plaintext block.', ...format1D(IP_DATA, 'IP'), examples: permutationExample('IP') },
    { id: 'ip1', title: 'Final Permutation (IP-1)', description: 'The final step of DES, the inverse of the Initial Permutation.', ...format1D(IP1_DATA, 'IP1'), examples: permutationExample('IP1') },
    { id: 'pc1', title: 'Permutation Choice 1 (PC-1)', description: 'Used in the key schedule to select 56 bits from the 64-bit key.', ...format1D(PC1_DATA, 'PC1'), examples: permutationExample('PC1')},
    { id: 'pc2', title: 'Permutation Choice 2 (PC-2)', description: 'Used in the key schedule to compress the 56-bit key to a 48-bit subkey for each round.', ...format1D(PC2_DATA, 'PC2'), examples: permutationExample('PC2')},
    { id: 'exp_d', title: 'Expansion D-Box (E)', description: 'Expands the 32-bit right half of the data to 48 bits, allowing it to be XORed with the round key.', ...format1D(EXP_D_DATA, 'EXP_D'), examples: permutationExample('EXP_D') },
    { id: 'pbox', title: 'P-Box Permutation', description: 'The final permutation in the DES function (f), which rearranges the output of the S-Boxes.', ...format1D(PBOX_DATA, 'PBOX'), examples: permutationExample('PBOX') },
    { id: 'sbox', title: 'Substitution Boxes (S-Boxes)', description: 'The non-linear core of DES, consisting of 8 unique boxes that substitute 6-bit inputs with 4-bit outputs.', ...format3D(SBOX_DATA, 'SBOX'), examples: sboxExample },
];
