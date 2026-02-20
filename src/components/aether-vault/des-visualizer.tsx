'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft, 
  Binary, 
  Key, 
  RefreshCw, 
  Cpu, 
  ArrowRightLeft,
  Hash,
  Activity
} from 'lucide-react';
import { getDESSteps } from '@/lib/ciphers/des-steps';

interface DESVisualizerProps {
  text: string;
  cipherKey: string;
  action: 'encrypt' | 'decrypt';
  onBack: () => void;
}

export function DESVisualizer({ text, cipherKey, action, onBack }: DESVisualizerProps) {
  const [activeTab, setActiveTab] = useState<'keys' | 'data'>('keys');
  const [keyStep, setKeyStep] = useState(0);
  const [dataStep, setDataStep] = useState(0);
  const stepTitleRef = useRef<HTMLHeadingElement>(null);
  
  const data = getDESSteps(text, cipherKey, action === 'decrypt');

  useEffect(() => {
    stepTitleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [keyStep, dataStep, activeTab]);
  
  const totalKeySteps = data.subkeySteps.length + 1; // PC1 + 16 Rounds
  const totalDataSteps = data.rounds.length + 2; // IP + 16 Rounds + FP

  const renderKeyStep = () => {
    if (keyStep === 0) {
      return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div className="flex items-center gap-2 text-primary">
            <Key className="w-5 h-5" />
            <h3 ref={stepTitleRef} className="font-bold text-lg">Permutation Choice 1 (PC-1)</h3>
          </div>
          <p className="text-sm text-muted-foreground italic">
            The 64-bit key is reduced to 56 bits by dropping parity bits and rearranging based on the PC-1 table.
          </p>
          <div className="p-4 bg-secondary/50 rounded-lg font-mono break-all border">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-tighter">56-bit Key (Hex)</div>
            <div className="text-xl font-bold">{data.pc1Key}</div>
            <div className="mt-2 text-[10px] break-all opacity-70 leading-tight">{data.pc1KeyBinary}</div>
          </div>
        </div>
      );
    }

    const step = data.subkeySteps[keyStep - 1];
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <RefreshCw className="w-5 h-5" />
            <h3 ref={stepTitleRef} className="font-bold text-lg">Key Round {keyStep}</h3>
          </div>
          <Badge variant="outline">Shift & PC-2</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-secondary/30 rounded-md border">
            <div className="text-[10px] text-muted-foreground uppercase mb-1">Left Shifted</div>
            <div className="font-mono text-[10px] break-all leading-tight">{step.shiftedLeft}</div>
          </div>
          <div className="p-3 bg-secondary/30 rounded-md border">
            <div className="text-[10px] text-muted-foreground uppercase mb-1">Right Shifted</div>
            <div className="font-mono text-[10px] break-all leading-tight">{step.shiftedRight}</div>
          </div>
        </div>

        <div className="p-4 bg-card text-card-foreground rounded-lg shadow-lg border">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-accent" />
            <span className="text-xs font-bold uppercase tracking-widest">Round Subkey K{keyStep}</span>
          </div>
          <div className="font-mono text-xl font-black">{step.subkey}</div>
        </div>
      </div>
    );
  };

  const renderDataStep = () => {
    if (dataStep === 0) {
      return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div className="flex items-center gap-2 text-primary">
            <RefreshCw className="w-5 h-5" />
            <h3 ref={stepTitleRef} className="font-bold text-lg">Initial Permutation (IP)</h3>
          </div>
          <p className="text-sm text-muted-foreground italic">
            The 64-bit input block is rearranged according to the IP table.
          </p>
          <div className="p-4 bg-secondary/50 rounded-lg font-mono break-all border">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-tighter">Output Block</div>
            <div className="text-xl font-bold">{data.initialPermutation}</div>
          </div>
        </div>
      );
    }

    if (dataStep <= 16) {
      const roundIdx = dataStep - 1;
      const round = data.rounds[roundIdx];
      return (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Cpu className="w-5 h-5" />
                <h3 ref={stepTitleRef} className="font-bold text-lg">{action === 'encrypt' ? 'Encryption' : 'Decryption'} Round {dataStep}</h3>
              </div>
              <Badge variant="outline" className="font-mono">Feistel Network</Badge>
            </div>

            {/* Split */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Step 1: Split to Left and Right halves</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-secondary/30 rounded-md border">
                  <div className="text-[10px] text-muted-foreground uppercase mb-1">Old Left side</div>
                  <div className="font-mono text-sm font-bold">{round.L}</div>
                </div>
                <div className="p-3 bg-secondary/30 rounded-md border">
                  <div className="text-[10px] text-muted-foreground uppercase mb-1">Old Right side</div>
                  <div className="font-mono text-sm font-bold">{round.R}</div>
                </div>
              </div>
            </div>

            {/* DES Function */}
            <div className="space-y-4 p-4 border-2 border-dashed border-primary/20 rounded-lg bg-primary/5">
              <p className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-4 h-4" /> Step 2: DES Function on Right Half
              </p>
              
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground">a. Expand Right Half (Expansion D-Box)</span>
                  <div className="font-mono p-2 bg-background border rounded text-xs break-all leading-tight">{round.expandedR}</div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground">b. XOR with Round Key (K{action === 'encrypt' ? dataStep : 17 - dataStep}: {round.key})</span>
                  <div className="font-mono p-2 bg-background border rounded text-xs break-all leading-tight">{round.xoredWithKey}</div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground">c. Substitute with S-Boxes (8 maps)</span>
                  <div className="font-mono p-2 bg-background border rounded text-xs font-bold">{round.sboxOutput}</div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground">d. Permutation Box P (P-Box result)</span>
                  <div className="font-mono p-2 bg-secondary/30 border rounded text-xs font-black">{round.fResult}</div>
                </div>
              </div>
            </div>

            {/* Result before Swap */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Step 3: Result Before Swap</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-secondary/30 rounded-md border">
                  <div className="text-[10px] text-muted-foreground uppercase mb-1">Left Half (L ⊕ f)</div>
                  <div className="font-mono text-sm font-bold">{round.xorWithOldLeft}</div>
                </div>
                <div className="p-3 bg-secondary/30 rounded-md border">
                  <div className="text-[10px] text-muted-foreground uppercase mb-1">Right Half (R)</div>
                  <div className="font-mono text-sm font-bold">{round.R}</div>
                </div>
              </div>
            </div>

            {/* Swap */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4" /> Step 4: {round.swapped ? "Swap Right and Left halves" : "Do NOT swap (Last Round)"}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-primary text-primary-foreground rounded-md shadow-md">
                  <div className="text-[10px] uppercase opacity-70 mb-1">New Left</div>
                  <div className="font-mono text-sm font-bold">{round.nextL}</div>
                </div>
                <div className="p-3 bg-primary text-primary-foreground rounded-md shadow-md">
                  <div className="text-[10px] uppercase opacity-70 mb-1">New Right</div>
                  <div className="font-mono text-sm font-bold">{round.nextR}</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      );
    }

    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
        <div className="flex items-center gap-2 text-primary">
          <Binary className="w-5 h-5" />
          <h3 ref={stepTitleRef} className="font-bold text-lg">Final Permutation (IP⁻¹)</h3>
        </div>
        <p className="text-sm text-muted-foreground italic">
          The inverse initial permutation is applied to get the final block.
        </p>
        <div className="p-4 bg-background rounded-lg font-mono break-all border shadow-inner">
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Final Ciphertext Output</div>
          <div className="text-2xl font-black text-foreground">{data.finalPermutation}</div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl border-2 border-primary/20">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Exit Visualizer
          </Button>
          <div className="text-right">
            <CardTitle className="text-xl font-headline">
              {action === 'encrypt' ? 'DES Encryption Trace' : 'DES Decryption Trace'}
            </CardTitle>
            <CardDescription>Comprehensive algorithm walkthrough</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
        <div className="px-6 pt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="keys" className="gap-2">
              <Key className="w-4 h-4" /> Key Schedule
            </TabsTrigger>
            <TabsTrigger value="data" className="gap-2">
              <Binary className="w-4 h-4" /> Data Rounds
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="keys" className="p-6 focus-visible:ring-0">
          <div className="min-h-[440px] flex flex-col justify-between">
            {renderKeyStep()}
            
            <div className="mt-8 pt-6 border-t flex items-center justify-between">
              <Button 
                variant="outline" 
                size="sm"
                disabled={keyStep === 0}
                onClick={() => setKeyStep(prev => prev - 1)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
              <div className="text-xs font-mono font-bold">Key Step {keyStep + 1} / {totalKeySteps}</div>
              <Button 
                variant="default" 
                size="sm"
                disabled={keyStep === totalKeySteps - 1}
                onClick={() => setKeyStep(prev => prev + 1)}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Next Step <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="data" className="p-6 focus-visible:ring-0">
          <div className="min-h-[440px] flex flex-col justify-between">
            {renderDataStep()}
            
            <div className="mt-8 pt-6 border-t flex items-center justify-between">
              <Button 
                variant="outline" 
                size="sm"
                disabled={dataStep === 0}
                onClick={() => setDataStep(prev => prev - 1)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
              <div className="text-xs font-mono font-bold">Round {dataStep} Trace</div>
              <Button 
                variant="default" 
                size="sm"
                disabled={dataStep === totalDataSteps - 1}
                onClick={() => setDataStep(prev => prev + 1)}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Next Step <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
