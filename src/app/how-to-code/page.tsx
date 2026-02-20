import { Code, Lightbulb, Puzzle, Key, FileText, CheckCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function HowToCodePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary rounded-full mb-4">
            <Lightbulb className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">How to Code These Ciphers</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Some observations and tips to help you build these algorithms from scratch.
          </p>
        </header>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Puzzle className="text-accent"/>Core Concepts</CardTitle>
              <CardDescription>
                These are the foundational ideas you'll see repeated across many ciphers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="font-semibold">Modular Arithmetic: The Clock of Cryptography</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>
                      Think of the alphabet as a clock with 26 hours. If you go past 'Z', you wrap back around to 'A'. This is the essence of modular arithmetic. The function `mod(n, 26)` is your best friend here. It ensures your calculations always result in a valid letter index (0-25).
                    </p>
                    <p>
                      You'll also need the <strong>Modular Multiplicative Inverse</strong> for ciphers like the Multiplicative and Affine ciphers. This is like finding the "opposite" of a number in modular arithmetic, which is crucial for decryption. It only works if the number is coprime to 26.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="font-semibold">Character ↔ Index Mapping</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>
                      Computers work with numbers, not letters. Before you can perform any math, you need to convert each character of your text into a number (e.g., A=0, B=1, ... Z=25). After your calculation, you must convert the resulting number back into a character.
                    </p>
                    <p>
                      The helper functions for `Character-Index Mapping` are designed for exactly this. Using a Map or Dictionary is the most common way to handle this conversion efficiently.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="font-semibold">Handling Letter Case</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>
                      To simplify your logic, it's a good practice to convert all input text to a single case (e.g., uppercase) before processing. This avoids having to handle both 'a' and 'A' as the same letter in your code.
                    </p>
                    <p>
                      A common convention, used in this app, is to make the final encrypted text uppercase and the decrypted plaintext lowercase. This makes it easy to distinguish between them at a glance.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="text-accent"/>Classical Ciphers (Character-Based)</CardTitle>
              <CardDescription>
                For ciphers like Additive, Vigenère, and Playfair.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4">
              <p>
                Most classical ciphers follow a similar pattern, making them a great place to start.
              </p>
              <div className="p-4 bg-background border rounded-lg space-y-2">
                <h4 className="font-semibold text-foreground">The General Recipe:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li><strong>Clean Inputs:</strong> Remove spaces, punctuation, and convert the text to a consistent case. Do the same for the key.</li>
                  <li><strong>Iterate:</strong> Loop through the text, either character by character or in pairs/groups (like in Playfair or Hill).</li>
                  <li><strong>Convert:</strong> Turn the character(s) into numeric indices.</li>
                  <li><strong>Calculate:</strong> Apply the cipher's core mathematical formula using the character index and the key. Remember to use the modulo operator!</li>
                  <li><strong>Convert Back:</strong> Turn the resulting number back into a character.</li>
                  <li><strong>Append:</strong> Add the new character to your result string.</li>
                </ol>
              </div>
               <p>
                The main difference between them lies in how the key is applied in Step 4. For an Additive cipher it's a simple shift; for Vigenère, the shift changes based on a keyword.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Key className="text-accent"/>Modern Ciphers (Block-Based)</CardTitle>
              <CardDescription>
                For algorithms like DES and AES.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4">
               <p>
                Modern ciphers are a big leap in complexity. They operate on fixed-size blocks of binary data, not individual letters. In this app, we represent this data using hexadecimal strings.
              </p>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="font-semibold">Block-Based Processing</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>
                      DES works on 64-bit blocks (16 hex characters) and AES-128 works on 128-bit blocks (32 hex characters). All operations are performed on the entire block at once, through multiple rounds of transformation.
                    </p>
                    <p>
                      The helper functions for converting a block to a 4x4 "State" matrix (for AES) and back are crucial for implementing these rounds correctly.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="font-semibold">Bitwise Operations and Hex</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>
                     The core of these ciphers is bitwise logic, especially the XOR operation. Because working with long binary strings is cumbersome, we use hexadecimal as a more compact representation.
                    </p>
                     <p>
                      You'll need reliable functions to convert between hex and binary, and to perform XOR on two hex strings. Check the "Helper Functions" page for these.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="font-semibold">Substitution and Permutation</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-2">
                    <p>
                      These ciphers are built on rounds of <strong>Substitution</strong> (like using an S-Box to replace a value) and <strong>Permutation</strong> (shuffling the bits around, like in a P-Box).
                    </p>
                    <p>
                      These steps are defined by large constant tables. You don't need to memorize them, just implement them correctly. The "AES Boxes" and "DES Boxes" pages provide all these constants in ready-to-use code formats.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

           <Card className="bg-accent/10 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent-foreground"><CheckCircle />Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="text-accent-foreground/80 space-y-2">
                <p>
                    The best way to learn is by doing. Start with the <strong>Additive Cipher</strong>—it's the simplest.
                </p>
                <p>
                    Use the <strong>Helper Functions</strong> page as your toolkit. Don't reinvent the wheel for things like modular inverse or hex-to-binary conversion.
                </p>
                <p>
                    When you're ready to tackle DES or AES, use the <strong>Step-by-Step Visualizers</strong> in this app. They are your ground truth. If your code's intermediate values match the visualizer's at every step, you're on the right track!
                </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
