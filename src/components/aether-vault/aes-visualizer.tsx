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
  Key, 
  RefreshCw, 
  Cpu, 
  Grid3x3,
  Hash,
  Activity,
  Shuffle
} from 'lucide-react';
import { getAESSteps, AESWordStep, AESBreakdown } from '@/lib/ciphers/aes-steps';
import { cn } from '@/lib/utils';

interface AESVisualizerProps {
  text: string;
  cipherKey: string;
  action: 'encrypt' | 'decrypt';
  onBack: () => void;
}

export function AESVisualizer({ text, cipherKey, action, onBack }: AESVisualizerProps) {
  const [activeTab, setActiveTab] = useState<'keys' | 'data'>('keys');
  const [keyStep, setKeyStep] = useState(0);
  const [dataStep, setDataStep] = useState(0);
  const stepTitleRef = useRef<HTMLHeadingElement>(null);
  
  const data: AESBreakdown = getAESSteps(text, cipherKey, action === 'decrypt');

  useEffect(() => {
    stepTitleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [keyStep, dataStep, activeTab]);
  
  const totalKeySteps = 11; // 11 subkeys (Round 0 to Round 10)
  const totalDataSteps = (data.encryptionRounds?.length || data.decryptionRounds?.length || 0) + 1;

  const renderStateMatrix = (state: string[][], label: string, variant: 'default' | 'primary' = 'default') => (
    <div className="space-y-2">
      <span className={cn(
        "text-[10px] uppercase font-bold",
        variant === 'primary' ? "text-primary-foreground/70" : "text-muted-foreground"
      )}>
        {label}
      </span>
      <div className={cn(
        "grid grid-cols-4 gap-1 p-2 border rounded-md font-mono text-sm text-center",
        variant === 'primary' ? "bg-black/20 border-white/10" : "bg-secondary/20"
      )}>
        {state.map((row, r) => (
          <React.Fragment key={r}>
            {row.map((cell, c) => (
              <div key={c} className={cn(
                "p-1 border rounded",
                variant === 'primary' ? "bg-white/10 border-white/20 text-white" : "bg-background"
              )}>
                {cell}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderWordExpansion = (ws: AESWordStep) => (
    <div key={ws.index} className="p-4 bg-secondary/20 border rounded-lg space-y-3">
      <div className="flex items-center justify-between border-b pb-2 mb-2">
        <span className="text-xs font-black text-accent uppercase">Word W{ws.index}</span>
        <Badge variant={ws.isSpecial ? "default" : "outline"} className="text-[9px]">
          {ws.isSpecial ? "Special: i % 4 == 0" : "Standard: i % 4 != 0"}
        </Badge>
      </div>

      {ws.isSpecial ? (
        <div className="space-y-3 text-[11px] font-mono">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground italic">1. Rotate W{ws.index-1} ({ws.prevWord}):</span>
            <div className="font-bold text-accent">{ws.rotated}</div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground italic">2. Subword (S-Box):</span>
            <div className="font-bold text-accent">{ws.substituted}</div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground italic">3. XOR with RCON {Math.floor(ws.index/4)} ({ws.rcon}):</span>
            <div className="font-bold text-accent">{ws.xorWithRcon}</div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground italic">4. XOR result with W{ws.index-4} ({ws.wordMinus4}):</span>
            <div className="font-bold text-accent bg-accent/10 p-1 rounded">{ws.result}</div>
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-[11px] font-mono">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground italic">W{ws.index} = W{ws.index-1} ⊕ W{ws.index-4}</span>
            <div className="flex items-center gap-2">
              <span>{ws.prevWord}</span>
              <span className="text-muted-foreground">⊕</span>
              <span>{ws.wordMinus4}</span>
            </div>
            <div className="font-bold text-accent bg-accent/10 p-1 rounded mt-1">Result: {ws.result}</div>
          </div>
        </div>
      )}
    </div>
  );

  const renderKeyStep = () => {
    const keyIndex = keyStep;
    const key = data.subKeys[keyIndex];
    const isInitial = keyIndex === 0;

    return (
      <ScrollArea className="h-[440px] pr-4">
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Key className="w-5 h-5" />
              <h3 ref={stepTitleRef} className="font-bold text-lg">{isInitial ? "Original Key (K0)" : `Subkey K${keyIndex} Generation`}</h3>
            </div>
            <Badge variant="outline">Key Schedule</Badge>
          </div>

          {isInitial ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground italic">
                The original 128-bit key is split into 4 words (W0 to W3).
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="p-3 bg-secondary/30 border rounded flex justify-between items-center">
                    <span className="text-xs font-bold text-muted-foreground">W{i}</span>
                    <span className="font-mono text-xs">{cipherKey.substring(i * 8, (i + 1) * 8).toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground italic">
                Generating words W{keyIndex * 4} to W{keyIndex * 4 + 3} using previous words.
              </p>
              <div className="grid grid-cols-1 gap-4">
                {data.wordSteps.slice((keyIndex - 1) * 4, keyIndex * 4).map(ws => renderWordExpansion(ws))}
              </div>
            </div>
          )}

          <div className="p-4 bg-card text-card-foreground rounded-lg shadow-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold uppercase tracking-widest">Full 128-bit Subkey (K{keyIndex})</span>
            </div>
            <div className="font-mono text-sm font-black break-all">{key}</div>
          </div>
        </div>
      </ScrollArea>
    );
  };
  
  const renderEncryptionStep = () => {
    if (dataStep === 0) {
      return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div className="flex items-center gap-2 text-primary">
            <RefreshCw className="w-5 h-5" />
            <h3 ref={stepTitleRef} className="font-bold text-lg">Initial Round (AddRoundKey K0)</h3>
          </div>
          <p className="text-sm text-muted-foreground italic">
            State is XORed with the original key before the main rounds start.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderStateMatrix(data.initialState, "Input State")}
            {renderStateMatrix(data.encryptionRounds![0].inputState, "State After Round 0")}
          </div>
        </div>
      );
    }

    const round = data.encryptionRounds![dataStep - 1];
    return (
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Cpu className="w-5 h-5" />
              <h3 ref={stepTitleRef} className="font-bold text-lg">AES Round {dataStep}</h3>
            </div>
            <Badge variant="outline" className="font-mono">SPN Structure</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderStateMatrix(round.inputState, "1. Round Input")}
            {renderStateMatrix(round.afterSubBytes!, "2. After SubBytes")}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderStateMatrix(round.afterShiftRows!, "3. After ShiftRows")}
            {round.afterMixColumns ? (
              renderStateMatrix(round.afterMixColumns, "4. After MixColumns")
            ) : (
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md bg-muted/20">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Round 10 Special</span>
                <span className="text-xs italic text-center">MixColumns skipped in final round</span>
              </div>
            )}
          </div>

          <div className="p-4 bg-card text-card-foreground rounded-lg shadow-lg border">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold uppercase tracking-widest">Step 5: AddRoundKey (K{dataStep})</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderStateMatrix(round.afterMixColumns || round.afterShiftRows!, "State Before AddKey", 'primary')}
              {renderStateMatrix(round.afterAddRoundKey, "Output State", 'primary')}
            </div>
            <div className="mt-4 p-2 bg-black/20 rounded font-mono text-[10px] break-all opacity-80 border border-white/10">
              <span className="font-bold text-accent mr-2">Round Key:</span>
              {round.roundKey}
            </div>
          </div>
        </div>
      </ScrollArea>
    );
  };
  
  const renderDecryptionStep = () => {
    if (dataStep === 0) {
      return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div className="flex items-center gap-2 text-primary">
            <RefreshCw className="w-5 h-5" />
            <h3 ref={stepTitleRef} className="font-bold text-lg">Initial Round (AddRoundKey K10)</h3>
          </div>
          <p className="text-sm text-muted-foreground italic">
            Decryption starts by XORing the ciphertext with subkey K10.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderStateMatrix(data.initialState, "Input Ciphertext")}
            {renderStateMatrix(data.decryptionRounds![0].inputState, "State After AddRoundKey")}
          </div>
        </div>
      );
    }
    
    const round = data.decryptionRounds![dataStep - 1];
    const roundNumber = dataStep;

    return (
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Shuffle className="w-5 h-5" />
              <h3 ref={stepTitleRef} className="font-bold text-lg">AES Decrypt Round {roundNumber}</h3>
            </div>
            <Badge variant="outline" className="font-mono">Inverse SPN</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderStateMatrix(round.inputState, "1. Round Input")}
            {renderStateMatrix(round.afterInvShiftRows, "2. After InvShiftRows")}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderStateMatrix(round.afterInvSubBytes, "3. After InvSubBytes")}
            {renderStateMatrix(round.afterAddRoundKey, "4. After AddRoundKey")}
          </div>

          <div className="p-2 bg-black/20 rounded font-mono text-[10px] break-all opacity-80 border border-white/10">
            <span className="font-bold text-accent mr-2">Round Key for Step 4 (K{10 - roundNumber}):</span>
            {round.roundKey}
          </div>

          <div className="p-4 bg-card text-card-foreground rounded-lg shadow-lg border">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold uppercase tracking-widest">Step 5: {round.afterInvMixColumns ? "InvMixColumns" : "Final Round Output"}</span>
            </div>
            {round.afterInvMixColumns ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderStateMatrix(round.afterAddRoundKey, "State Before InvMix", 'primary')}
                {renderStateMatrix(round.afterInvMixColumns, "Output State", 'primary')}
              </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-4">
                  <span className="text-sm font-bold">Final round. No InvMixColumns.</span>
                  <div className="mt-4">{renderStateMatrix(round.afterAddRoundKey, "Plaintext Block", "primary")}</div>
                </div>
            )}
          </div>
        </div>
      </ScrollArea>
    );
  };

  return (
    <Card className="w-full shadow-2xl border-2 border-primary/20">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Exit Visualizer
          </Button>
          <div className="text-right">
            <CardTitle className="text-xl font-headline">
              {action === 'encrypt' ? 'AES-128 Encryption Trace' : 'AES-128 Decryption Trace'}
            </CardTitle>
            <CardDescription>Visual block-by-block processing</CardDescription>
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
              <Grid3x3 className="w-4 h-4" /> Data Rounds
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
              <div className="text-xs font-mono font-bold">Subkey K{keyStep}</div>
              <Button 
                variant="default" 
                size="sm"
                disabled={keyStep === totalKeySteps - 1}
                onClick={() => setKeyStep(prev => prev + 1)}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Next Key <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="data" className="p-6 focus-visible:ring-0">
          <div className="min-h-[440px] flex flex-col justify-between">
            {action === 'encrypt' ? renderEncryptionStep() : renderDecryptionStep()}
            
            <div className="mt-8 pt-6 border-t flex items-center justify-between">
              <Button 
                variant="outline" 
                size="sm"
                disabled={dataStep === 0}
                onClick={() => setDataStep(prev => prev - 1)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
              <div className="text-xs font-mono font-bold">{dataStep === 0 ? "Initial State" : `Round ${dataStep}`}</div>
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
