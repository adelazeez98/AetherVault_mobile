'use client';

import { BookOpen } from 'lucide-react';
import { AES_BOXES } from '@/lib/aes-boxes-data';
import { AesBoxDisplay } from '@/components/aether-vault/aes-box-display';

export default function AesBoxesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-6">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary rounded-full mb-4">
            <BookOpen className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">AES Reference Constants</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Standard constants used in the Advanced Encryption Standard algorithm.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {AES_BOXES.map((box) => (
            <AesBoxDisplay
              key={box.id}
              title={box.title}
              description={box.description}
              java={box.java}
              python={box.python}
              cpp={box.cpp}
              examples={box.examples}
            />
          ))}
        </div>
      </div>
    </main>
  );
}