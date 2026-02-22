
'use client';

import { Wrench } from 'lucide-react';
import { HELPER_FUNCTIONS } from '@/lib/helper-functions-data';
import { HelperFunctionDisplay } from '@/components/aether-vault/helper-function-display';
import { Gf28Multiplication } from '@/components/aether-vault/gf28-multiplication';
import { Separator } from '@/components/ui/separator';

export default function HelperFunctionsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary rounded-full mb-4">
            <Wrench className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Crypto Helper Functions</h1>
          <p className="text-lg text-muted-foreground mt-2">
            A collection of common helper functions and tools for implementing cryptographic algorithms.
          </p>
        </header>

        <div className="mb-12">
          <Gf28Multiplication />
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
