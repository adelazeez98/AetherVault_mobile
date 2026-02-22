
export interface HelperFunction {
  id: string;
  title: string;
  description: string;
  java: string;
  python: string;
  cpp: string;
}

export const HELPER_FUNCTIONS: HelperFunction[] = [
    {
        id: 'gcd',
        title: 'Greatest Common Divisor (GCD)',
        description: 'Calculates the greatest common divisor of two integers using the Euclidean algorithm. This is fundamental for finding modular inverses and checking for coprime numbers.',
        java: `public static int gcd(int a, int b) {
    if (b == 0) {
        return a;
    } else {
        return gcd(b, a % b);
    }
}`,
        python: `import math

def gcd(a, b):
    # Python's math library has a built-in gcd function
    return math.gcd(a, b)

# Or, implemented recursively:
def recursive_gcd(a, b):
    if b == 0:
        return a
    else:
        return recursive_gcd(b, a % b)
`,
        cpp: `#include <numeric> // Required for std::gcd in C++17

int gcd(int a, int b) {
    return std::gcd(a, b);
}

// Or, implemented recursively:
int recursive_gcd(int a, int b) {
    if (b == 0) {
        return a;
    }
    return recursive_gcd(b, a % b);
}`
    },
    {
        id: 'modInverse',
        title: 'Modular Multiplicative Inverse',
        description: 'Finds the modular multiplicative inverse of an integer `a` modulo `m`. It uses the Extended Euclidean Algorithm. The inverse exists only if `a` and `m` are coprime.',
        java: `public static int modInverse(int r1, int r2) {
    int rr = r1;
    int t1, t2, t, q, r;
    t1 = 0;
    t2 = 1;
    while (r2 > 0) {
        q = r1 / r2;
        r = r1 - q * r2;
        t = t1 - q * t2;
        r1 = r2;
        r2 = r;
        t1 = t2;
        t2 = t;
    }
    if (r1 == 1) {
        if (t1 < 0) {
            t1 = rr + t1;
        }
    }
    return t1;
}`,
        python: `# For Python 3.8+
def mod_inverse(a, m):
    # This is the most efficient way
    return pow(a, -1, m)

# Implementation using Extended Euclidean Algorithm
def extended_gcd(a, b):
    if a == 0:
        return b, 0, 1
    d, x1, y1 = extended_gcd(b % a, a)
    x = y1 - (b // a) * x1
    y = x1
    return d, x, y

def mod_inverse_manual(a, m):
    d, x, y = extended_gcd(a, m)
    if d != 1:
        raise Exception('modular inverse does not exist')
    return x % m
`,
        cpp: `int modInverse(int a, int m) {
    int m0 = m;
    int y = 0, x = 1;

    if (m == 1)
        return 0;

    while (a > 1) {
        int q = a / m;
        int t = m;

        m = a % m;
        a = t;
        t = y;

        y = x - q * y;
        x = t;
    }

    if (x < 0)
        x += m0;

    return x;
}`
    },
    {
        id: 'charIndexMaps',
        title: 'Character-Index Mapping',
        description: 'Creates hash maps (or dictionaries) to convert between characters (\'a\'-\'z\') and their corresponding integer indices (0-25). This is essential for classical ciphers.',
        java: `import java.util.HashMap;

public static HashMap<Integer, Character> getIndexToCharacterMap() {
    HashMap<Integer, Character> map = new HashMap<>();
    for (int i = 0; i < 26; i++) {
        map.put(i, (char) ('a' + i));
    }
    return map;
}

public static HashMap<Character, Integer> getCharacterToIndexMap() {
    HashMap<Character, Integer> map = new HashMap<>();
    for (int i = 0; i < 26; i++) {
        map.put((char) ('a' + i), i);
    }
    return map;
}`,
        python: `def get_index_to_char_map():
    return {i: chr(ord('a') + i) for i in range(26)}

def get_char_to_index_map():
    return {chr(ord('a') + i): i for i in range(26)}`,
        cpp: `#include <map>

std::map<int, char> getIndexToCharacterMap() {
    std::map<int, char> map;
    for (int i = 0; i < 26; i++) {
        map[i] = (char)('a' + i);
    }
    return map;
}

std::map<char, int> getCharacterToIndexMap() {
    std::map<char, int> map;
    for (int i = 0; i < 26; i++) {
        map[(char)('a' + i)] = i;
    }
    return map;
}`
    },
    {
        id: 'padWithZeros',
        title: 'Pad with Zeros',
        description: 'Pads a string with leading zeros to meet a specified total length `n`. Useful for formatting binary and hexadecimal numbers.',
        java: `public static String padWithZeros(String s, int n) {
    StringBuilder paddedString = new StringBuilder(s);
    while (paddedString.length() < n) {
        paddedString.insert(0, '0');
    }
    return paddedString.toString();
}`,
        python: `def pad_with_zeros(s, n):
    # Python's built-in zfill is perfect for this
    return s.zfill(n)`,
        cpp: `#include <string>
#include <algorithm>

std::string padWithZeros(std::string s, int n) {
    if (s.length() >= n) {
        return s;
    }
    return std::string(n - s.length(), '0') + s;
}`
    },
    {
        id: 'hexBinary',
        title: 'Hex ↔ Binary Conversion',
        description: 'Functions to convert between hexadecimal strings and their binary string representations.',
        java: `public static String hexToBinary(String hex) {
    StringBuilder binary = new StringBuilder();
    for (char hexChar : hex.toCharArray()) {
        int i = Integer.parseInt(String.valueOf(hexChar), 16);
        binary.append(String.format("%4s", Integer.toBinaryString(i)).replace(' ', '0'));
    }
    return binary.toString();
}

public static String binaryToHex(String bin) {
    StringBuilder hex = new StringBuilder();
    for (int i = 0; i < bin.length(); i += 4) {
        String fourBits = bin.substring(i, i + 4);
        int decimal = Integer.parseInt(fourBits, 2);
        hex.append(Integer.toHexString(decimal).toUpperCase());
    }
    return hex.toString();
}`,
        python: `def hex_to_binary(hex_str):
    return bin(int(hex_str, 16))[2:].zfill(len(hex_str) * 4)

def binary_to_hex(bin_str):
    return hex(int(bin_str, 2))[2:].upper()`,
        cpp: `#include <string>
#include <cctype> // For toupper

std::string hexToBinary(const std::string& hex) {
    std::string binaryString = "";
    for (char hexChar : hex) {
        switch(toupper(hexChar)) {
            case '0': binaryString += "0000"; break;
            case '1': binaryString += "0001"; break;
            case '2': binaryString += "0010"; break;
            case '3': binaryString += "0011"; break;
            case '4': binaryString += "0100"; break;
            case '5': binaryString += "0101"; break;
            case '6': binaryString += "0110"; break;
            case '7': binaryString += "0111"; break;
            case '8': binaryString += "1000"; break;
            case '9': binaryString += "1001"; break;
            case 'A': binaryString += "1010"; break;
            case 'B': binaryString += "1011"; break;
            case 'C': binaryString += "1100"; break;
            case 'D': binaryString += "1101"; break;
            case 'E': binaryString += "1110"; break;
            case 'F': binaryString += "1111"; break;
        }
    }
    return binaryString;
}

std::string binaryToHex(const std::string& bin) {
    std::string hexString = "";
    for (size_t i = 0; i < bin.length(); i += 4) {
        std::string fourBits = bin.substr(i, 4);
        if (fourBits == "0000") hexString += "0";
        else if (fourBits == "0001") hexString += "1";
        else if (fourBits == "0010") hexString += "2";
        else if (fourBits == "0011") hexString += "3";
        else if (fourBits == "0100") hexString += "4";
        else if (fourBits == "0101") hexString += "5";
        else if (fourBits == "0110") hexString += "6";
        else if (fourBits == "0111") hexString += "7";
        else if (fourBits == "1000") hexString += "8";
        else if (fourBits == "1001") hexString += "9";
        else if (fourBits == "1010") hexString += "A";
        else if (fourBits == "1011") hexString += "B";
        else if (fourBits == "1100") hexString += "C";
        else if (fourBits == "1101") hexString += "D";
        else if (fourBits == "1110") hexString += "E";
        else if (fourBits == "1111") hexString += "F";
    }
    return hexString;
}`
    },
    {
        id: 'xor',
        title: 'Hexadecimal XOR',
        description: 'Performs a bitwise XOR operation between two hexadecimal strings.',
        java: `public static String performXOR(String x, String y) {
    int maxLength = Math.max(x.length(), y.length());
    // Use BigInteger for arbitrary length hex strings
    java.math.BigInteger x_bi = new java.math.BigInteger(x, 16);
    java.math.BigInteger y_bi = new java.math.BigInteger(y, 16);
    java.math.BigInteger result_bi = x_bi.xor(y_bi);
    
    String resultHex = result_bi.toString(16).toUpperCase();
    
    // Pad with leading zeros if necessary
    while (resultHex.length() < maxLength) {
        resultHex = "0" + resultHex;
    }
    return resultHex;
}`,
        python: `def perform_xor(x, y):
    res_int = int(x, 16) ^ int(y, 16)
    res_hex = hex(res_int)[2:].upper()
    max_len = max(len(x), len(y))
    return res_hex.zfill(max_len)`,
        cpp: `#include <string>
#include <algorithm>
#include <sstream>

std::string performXOR(std::string x, std::string y) {
    // This C++ example is simplified and may not handle very large hex strings.
    // For arbitrary precision, a library like OpenSSL's BIGNUM would be needed.
    size_t max_len = std::max(x.length(), y.length());
    unsigned long long x_val = std::stoull(x, nullptr, 16);
    unsigned long long y_val = std::stoull(y, nullptr, 16);
    
    unsigned long long res_val = x_val ^ y_val;
    
    std::stringstream ss;
    ss << std::hex << std::uppercase << res_val;
    std::string result = ss.str();
    
    if (result.length() < max_len) {
        result.insert(0, max_len - result.length(), '0');
    }
    return result;
}`
    },
    {
        id: 'gf28',
        title: 'Galois Field (2^8) Multiplication',
        description: 'Calculates the product of two bytes in the Galois Field GF(2^8) with the specific irreducible polynomial x^8 + x^4 + x^3 + x + 1, used in the AES MixColumns step.',
        java: `public static int multiplyInGF(int a, int b) {
    int result = 0;
    for (int i = 0; i < 8; i++) {
        if ((b & 1) != 0) {
            result ^= a;
        }
        boolean highBitSet = (a & 0x80) != 0;
        a <<= 1;
        if (highBitSet) {
            a ^= 0x1B; // Irreducible polynomial
        }
        b >>= 1;
    }
    return result & 0xFF;
}`,
        python: `def multiply_in_gf(a, b):
    result = 0
    for _ in range(8):
        if (b & 1) != 0:
            result ^= a
        
        high_bit_set = (a & 0x80) != 0
        a <<= 1
        if high_bit_set:
            a ^= 0x1B # Irreducible polynomial
        
        b >>= 1
    return result & 0xFF`,
        cpp: `#include <cstdint>

uint8_t multiplyInGF(uint8_t a, uint8_t b) {
    uint8_t result = 0;
    for (int i = 0; i < 8; ++i) {
        if (b & 1) {
            result ^= a;
        }
        
        bool high_bit_set = (a & 0x80);
        a <<= 1;
        if (high_bit_set) {
            a ^= 0x1B; // Irreducible polynomial
        }
        
        b >>= 1;
    }
    return result;
}`
    },
    {
        id: 'blockState',
        title: 'AES Block ↔ State Conversion',
        description: 'Functions to convert a 128-bit (32-hex-char) block into a 4x4 state matrix and back, as required by AES.',
        java: `public static String[][] convertBlockToState(String s) {
    String[][] state = new String[4][4];
    int index = 0;
    for (int i = 0; i < 4; i++) { // Column-major order
        for (int j = 0; j < 4; j++) {
            state[j][i] = s.substring(index, index + 2);
            index += 2;
        }
    }
    return state;
}

public static String convertStateToBlock(String[][] state) {
    StringBuilder result = new StringBuilder();
    for (int i = 0; i < 4; i++) { // Column-major order
        for (int j = 0; j < 4; j++) {
            result.append(state[j][i]);
        }
    }
    return result.toString();
}`,
        python: `def convert_block_to_state(s):
    state = [['' for _ in range(4)] for _ in range(4)]
    index = 0
    for c in range(4): # Column-major order
        for r in range(4):
            state[r][c] = s[index:index+2]
            index += 2
    return state

def convert_state_to_block(state):
    result = ""
    for c in range(4): # Column-major order
        for r in range(4):
            result += state[r][c]
    return result`,
        cpp: `#include <vector>
#include <string>

using State = std::vector<std::vector<std::string>>;

State convertBlockToState(std::string s) {
    State state(4, std::vector<std::string>(4));
    int index = 0;
    for (int i = 0; i < 4; ++i) { // Column-major
        for (int j = 0; j < 4; ++j) {
            state[j][i] = s.substr(index, 2);
            index += 2;
        }
    }
    return state;
}

std::string convertStateToBlock(const State& state) {
    std::string result = "";
    for (int i = 0; i < 4; ++i) { // Column-major
        for (int j = 0; j < 4; ++j) {
            result += state[j][i];
        }
    }
    return result;
}`
    },
    {
        id: 'sam',
        title: 'Square-and-Multiply Algorithm',
        description: 'An efficient algorithm for modular exponentiation, calculating `(a^x) mod n`. It is a cornerstone of public-key cryptography like RSA.',
        java: `public static int squareAndMultiply(int a, int x, int n) {
    String xAsBinary = Integer.toBinaryString(x);
    long y = 1; // Use long to prevent overflow

    for (int i = 0; i < xAsBinary.length(); i++) {
        y = (y * y) % n;
        if (xAsBinary.charAt(i) == '1') {
            y = (y * a) % n;
        }
    }
    return (int) y;
}`,
        python: `def square_and_multiply(a, x, n):
    # Python's built-in pow(a, x, n) is highly optimized for this.
    return pow(a, x, n)

# Manual implementation for learning
def manual_sam(a, x, n):
    y = 1
    a = a % n
    while x > 0:
        if x % 2 == 1:
           y = (y * a) % n
        x = x >> 1 # x = x // 2
        a = (a * a) % n
    return y
`,
        cpp: `long long squareAndMultiply(long long a, long long x, long long n) {
    long long y = 1;
    a = a % n;
    while (x > 0) {
        if (x % 2 == 1) {
            y = (y * a) % n;
        }
        x = x >> 1; // x = x / 2
        a = (a * a) % n;
    }
    return y;
}`
    }
];
