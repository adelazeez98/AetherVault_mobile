'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { CipherForm } from '@/components/aether-vault/cipher-form';
import { Algorithm, ALGORITHM_CONFIG } from '@/lib/cipher-config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function Home() {
  const [algorithm, setAlgorithm] = useState<Algorithm>(Algorithm.Caesar);
  const config = ALGORITHM_CONFIG[algorithm];

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary rounded-full mb-4">
            <Lock className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">AetherVault</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Securely encrypt and decrypt text on your device.
          </p>
        </header>

        <div className="space-y-8">
          <div className="w-full max-w-2xl mx-auto space-y-2">
            <Label>Select an Algorithm</Label>
            <Select
              onValueChange={(value) => setAlgorithm(value as Algorithm)}
              defaultValue={algorithm}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an algorithm" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Algorithm).map((algo) => (
                  <SelectItem key={algo} value={algo}>
                    {ALGORITHM_CONFIG[algo].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {config && (
            <CipherForm 
              key={algorithm} // To reset state on change
              type={algorithm}
              name={config.name}
              description={config.description}
            />
          )}
        </div>
      </div>
    </main>
  );
}
