'use client';

import { Wrench, ChevronsUpDown } from 'lucide-react';
import { HELPER_FUNCTIONS } from '@/lib/helper-functions-data';
import { HelperFunctionDisplay } from '@/components/aether-vault/helper-function-display';
import { Gf28Multiplication } from '@/components/aether-vault/gf28-multiplication';
import { ModularInverse } from '@/components/aether-vault/modular-inverse';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';

export default function HelperFunctionsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary rounded-full mb-4">
            <Wrench className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Crypto Helper Functions</h1>
          <p className="text-lg text-muted-foreground mt-2">
            A collection of common helper functions and tools for implementing cryptographic algorithms.
          </p>
        </header>

        <div className="space-y-8 mb-12">
           <Accordion type="multiple" className="w-full space-y-6">
              <AccordionItem value="item-1" className="border-b-0">
                <Card className="shadow-lg border-primary/20">
                  <AccordionTrigger className="p-6 text-left hover:no-underline">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold">Interactive Multiplication in GF(2^8)</h2>
                        <p className="text-sm text-muted-foreground mt-1">Perform multiplication in the Galois Field used in AES MixColumns.</p>
                      </div>
                  </AccordionTrigger>
                  <AccordionContent>
                      <CardContent className="pt-4">
                        <Gf28Multiplication />
                      </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-b-0">
                <Card className="shadow-lg border-primary/20">
                    <AccordionTrigger className="p-6 text-left hover:no-underline">
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold">Interactive Modular Inverse</h2>
                            <p className="text-sm text-muted-foreground mt-1">Find the modular multiplicative inverse of a number 'a' such that (a * x) mod m = 1.</p>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <CardContent className="pt-4">
                            <ModularInverse />
                        </CardContent>
                    </AccordionContent>
                </Card>
              </AccordionItem>
          </Accordion>
        </div>

        <div className="text-center mb-12">
          <Separator />
          <h2 className="text-3xl font-bold text-foreground mt-12">Static Function Reference</h2>
          <p className="text-md text-muted-foreground mt-2">
            Code snippets for common cryptographic helper functions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {HELPER_FUNCTIONS.map((func) => (
            <HelperFunctionDisplay
              key={func.id}
              title={func.title}
              description={func.description}
              java={func.java}
              python={func.python}
              cpp={func.cpp}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
